import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { BadRequestException } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

describe('UploadController', () => {
  let controller: UploadController;
  let service: UploadService;

  const mockUploadService = {
    uploadPhoto: jest.fn(),
    uploadPhotos: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    })
      .overrideGuard(JwtGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should upload photo successfully', () => {
      const mockFile = createMockFile('image/jpeg', 1024, 'test.jpg');
      const mockUrl = '/uploads/test-uuid.jpg';

      mockUploadService.uploadPhoto.mockReturnValue(mockUrl);

      const result = controller.uploadPhoto(mockFile);

      expect(result.success).toBe(true);
      expect(result.message).toBe('Photo uploaded successfully');
      expect(result.data).toEqual({ url: mockUrl });
      expect(service.uploadPhoto).toHaveBeenCalledWith(mockFile);
    });

    it('should throw error if no file provided', () => {
      expect(() => controller.uploadPhoto(undefined as any)).toThrow(
        BadRequestException,
      );
      expect(() => controller.uploadPhoto(undefined as any)).toThrow(
        'No file uploaded',
      );
    });

    it('should throw error if file is null', () => {
      expect(() => controller.uploadPhoto(null as any)).toThrow(
        BadRequestException,
      );
      expect(() => controller.uploadPhoto(null as any)).toThrow(
        'No file uploaded',
      );
    });

    it('should handle different file types', () => {
      const fileTypes = [
        { mimetype: 'image/jpeg', ext: 'jpg' },
        { mimetype: 'image/png', ext: 'png' },
        { mimetype: 'image/webp', ext: 'webp' },
        { mimetype: 'image/gif', ext: 'gif' },
      ];

      fileTypes.forEach(({ mimetype, ext }) => {
        const mockFile = createMockFile(mimetype, 1024, `test.${ext}`);
        const mockUrl = `/uploads/test-uuid.${ext}`;

        mockUploadService.uploadPhoto.mockReturnValue(mockUrl);

        const result = controller.uploadPhoto(mockFile);

        expect(result.success).toBe(true);
        expect(result.data.url).toBe(mockUrl);
      });
    });

    it('should propagate service errors', () => {
      const mockFile = createMockFile('image/jpeg', 1024, 'test.jpg');

      mockUploadService.uploadPhoto.mockImplementation(() => {
        throw new BadRequestException('File size exceeds 10MB limit');
      });

      expect(() => controller.uploadPhoto(mockFile)).toThrow(
        BadRequestException,
      );
      expect(() => controller.uploadPhoto(mockFile)).toThrow(
        'File size exceeds 10MB limit',
      );
    });
  });
});
