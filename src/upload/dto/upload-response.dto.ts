import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/common/dtos/base-response.dto';

export class UploadDto {
  @ApiProperty({ example: 'http://localhost:8000/uploads/photo-123456.jpg' })
  url: string;
}

export class UploadResponseDto extends BaseResponseDto {
  @ApiProperty({ type: UploadDto })
  data: UploadDto;
}
