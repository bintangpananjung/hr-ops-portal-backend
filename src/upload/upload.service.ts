import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadPath = join(process.cwd(), 'uploads');
  private readonly allowedMimeTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ];
  private readonly maxFileSize = 10 * 1024 * 1024;

  constructor() {
    if (!existsSync(this.uploadPath)) {
      mkdirSync(this.uploadPath, { recursive: true });
    }
  }

  uploadPhoto(file: Express.Multer.File): string {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed',
      );
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException('File size exceeds 10MB limit');
    }

    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const filename = `${randomUUID()}.${fileExtension}`;
    const filepath = join(this.uploadPath, filename);

    writeFileSync(filepath, file.buffer);

    return `/uploads/${filename}`;
  }

  uploadPhotos(files: Express.Multer.File[]): string[] {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files provided');
    }

    const uploadedFiles: string[] = [];

    for (const file of files) {
      const url = this.uploadPhoto(file);
      uploadedFiles.push(url);
    }

    return uploadedFiles;
  }
}
