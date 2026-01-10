import { BaseResponseDto } from '../dtos/base-response.dto';

export class ResponseMapper {
  static toSuccessResponse<T>(
    data: T,
    message: string,
  ): BaseResponseDto & { data: T } {
    return {
      success: true,
      message,
      data,
    };
  }

  static toErrorResponse(message: string): BaseResponseDto {
    return {
      success: false,
      message,
    };
  }
}
