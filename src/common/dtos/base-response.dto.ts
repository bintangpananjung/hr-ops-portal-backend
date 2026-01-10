import { Exclude, Expose } from 'class-transformer';

export class BaseResponseDto<T> {
  @Expose()
  success: boolean;

  @Expose()
  message: string;

  @Expose()
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
