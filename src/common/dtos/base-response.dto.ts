import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto<T> {
  @ApiProperty({ example: true })
  success: boolean;

  @ApiProperty({ example: 'Request successful' })
  message: string;

  @ApiProperty({ example: null })
  data: T;

  constructor(success: boolean, message: string, data: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(
    data: T,
    message = 'Request successful',
  ): BaseResponseDto<T> {
    return new BaseResponseDto(true, message, data);
  }

  static error<T = null>(
    message: string,
    data: T = null as T,
  ): BaseResponseDto<T> {
    return new BaseResponseDto(false, message, data);
  }
}
