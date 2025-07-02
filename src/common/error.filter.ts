import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import { ResponseApi } from 'src/model/response';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response: Response = host.switchToHttp().getResponse();

    if (exception instanceof ZodError) {
      const errors = exception.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      const errorResponse: ResponseApi<any> = {
        status_code: 400,
        message: 'Validation failed',
        errors: errors,
      };

      response.status(400).json(errorResponse);
    } else if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message;

      const errorResponse: ResponseApi<any> = {
        status_code: status,
        message: message,
      };

      response.status(status).json(errorResponse);
    } else {
      const errorResponse: ResponseApi<any> = {
        status_code: 500,
        message: 'Internal server error',
      };

      response.status(500).json(errorResponse);
    }
  }
}
