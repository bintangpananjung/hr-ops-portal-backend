import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ example: 'http://localhost:8000/uploads/photo-123456.jpg' })
  url: string;
}
