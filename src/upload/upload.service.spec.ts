import { Test, TestingModule } from '@nestjs/testing';
import { UploadService } from './upload.service';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

jest.mock('fs');

describe('UploadService', () => {
  let service: UploadService;

  beforeEach(async () => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.mkdirSync as jest.Mock).mockReturnValue(undefined);
    (fs.writeFileSync as jest.Mock).mockReturnValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadService],
    }).compile();

    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadPhoto', () => {
    const createMockFile = (
      mimetype: string,
      size: number,
      originalname: string,
    ): Express.Multer.File => ({
      fieldname: 'file',
      originalname,
      encoding: '7bit',
      mimetype,
      size,
      buffer: Buffer.from('test file content'),
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    });

    it('should upload a valid JPEG file', () => {
      const mockFile = createMockFile('image/jpeg', 1024 * 1024, 'test.jpg');

      const result = service.uploadPhoto(mockFile);

      expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.jpg$/);
    });

    it('should upload a valid PNG file', () => {
      const mockFile = createMockFile('image/png', 1024 * 1024, 'test.png');

      const result = service.uploadPhoto(mockFile);

      expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.png$/);
    });

    it('should upload a valid WEBP file', () => {
      const mockFile = createMockFile('image/webp', 1024 * 1024, 'test.webp');

      const result = service.uploadPhoto(mockFile);

      expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.webp$/);
    });

    it('should upload a valid GIF file', () => {
      const mockFile = createMockFile('image/gif', 1024 * 1024, 'test.gif');

      const result = service.uploadPhoto(mockFile);

      expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.gif$/);
    });

    it('should throw error if no file provided', () => {
      expect(() => service.uploadPhoto(null as any)).toThrow(
        BadRequestException,
      );
      expect(() => service.uploadPhoto(null as any)).toThrow(
        'No file provided',
      );
    });

    it('should throw error for invalid file type', () => {
      const mockFile = createMockFile('application/pdf', 1024, 'test.pdf');

      expect(() => service.uploadPhoto(mockFile)).toThrow(BadRequestException);
      expect(() => service.uploadPhoto(mockFile)).toThrow(
        'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed',
      );
    });

    it('should throw error for file size exceeding limit', () => {
      const mockFile = createMockFile(
        'image/jpeg',
        11 * 1024 * 1024,
        'large.jpg',
      );

      expect(() => service.uploadPhoto(mockFile)).toThrow(BadRequestException);
      expect(() => service.uploadPhoto(mockFile)).toThrow(
        'File size exceeds 10MB limit',
      );
    });

    it('should handle file without extension', () => {
      const mockFile = createMockFile('image/jpeg', 1024, 'testfile');

      const result = service.uploadPhoto(mockFile);

      expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.testfile$/);
    });

    it('should handle JPG mimetype', () => {
      const mockFile = createMockFile('image/jpg', 1024, 'test.jpg');

      const result = service.uploadPhoto(mockFile);

      expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.jpg$/);
    });
  });

  describe('uploadPhotos', () => {
    const createMockFile = (
      mimetype: string,
      size: number,
      originalname: string,
    ): Express.Multer.File => ({
      fieldname: 'files',
      originalname,
      encoding: '7bit',
      mimetype,
      size,
      buffer: Buffer.from('test file content'),
      stream: null as any,
      destination: '',
      filename: '',
      path: '',
    });

    it('should upload multiple valid files', () => {
      const mockFiles = [
        createMockFile('image/jpeg', 1024, 'test1.jpg'),
        createMockFile('image/png', 1024, 'test2.png'),
        createMockFile('image/webp', 1024, 'test3.webp'),
      ];

      const results = service.uploadPhotos(mockFiles);

      expect(results).toHaveLength(3);
      results.forEach((result) => {
        expect(result).toMatch(/^\/uploads\/[a-f0-9-]+\.(jpg|png|webp)$/);
      });
    });

    it('should throw error if no files provided', () => {
      expect(() => service.uploadPhotos(null as any)).toThrow(
        BadRequestException,
      );
      expect(() => service.uploadPhotos(null as any)).toThrow(
        'No files provided',
      );
    });

    it('should throw error if empty array provided', () => {
      expect(() => service.uploadPhotos([])).toThrow(BadRequestException);
      expect(() => service.uploadPhotos([])).toThrow('No files provided');
    });

    it('should throw error if any file is invalid', () => {
      const mockFiles = [
        createMockFile('image/jpeg', 1024, 'test1.jpg'),
        createMockFile('application/pdf', 1024, 'test2.pdf'),
      ];

      expect(() => service.uploadPhotos(mockFiles)).toThrow(
        BadRequestException,
      );
    });

    it('should throw error if any file exceeds size limit', () => {
      const mockFiles = [
        createMockFile('image/jpeg', 1024, 'test1.jpg'),
        createMockFile('image/png', 11 * 1024 * 1024, 'large.png'),
      ];

      expect(() => service.uploadPhotos(mockFiles)).toThrow(
        BadRequestException,
      );
    });
  });
});
