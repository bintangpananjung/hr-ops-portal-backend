import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseMapper } from '../mappers/response.mapper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    let message: string;
    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (
      typeof exceptionResponse === 'object' &&
      exceptionResponse !== null &&
      'message' in exceptionResponse
    ) {
      const msg = exceptionResponse.message;
      message = Array.isArray(msg) ? msg.join(', ') : String(msg);
    } else {
      message = 'An error occurred';
    }

    const errorResponse = ResponseMapper.toErrorResponse(message);

    response.status(status).json(errorResponse);
  }
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const isDevelopment = process.env.NODE_ENV === 'development';

    let message: string;
    if (exception instanceof HttpException) {
      message = exception.message;
    } else if (exception instanceof Error) {
      message = isDevelopment
        ? `${exception.message}\n\nStack trace:\n${exception.stack}`
        : 'Internal server error';
    } else {
      message = isDevelopment
        ? `Unknown error: ${String(exception)}`
        : 'Internal server error';
    }

    const errorResponse = ResponseMapper.toErrorResponse(message);

    response.status(status).json(errorResponse);
  }
}
