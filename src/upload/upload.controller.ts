import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

@Controller('upload')
@UseGuards(JwtGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const url = this.uploadService.uploadPhoto(file);
    return BaseResponseDto.success({ url }, 'Photo uploaded successfully');
  }
}
