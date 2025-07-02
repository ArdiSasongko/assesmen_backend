import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { ResponseApi } from 'src/model/response';
import { ZodError } from 'zod';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

@Catch()
export class ErrorFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: { field: string; message: string; code: string }[] | null =
      null;

    this.logger.error('Exception occurred', {
      path: request.url,
      method: request.method,
      error: exception.message,
      stack: exception.stack,
      timestamp: new Date().toISOString(),
    });

    if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.issues.map((issue) => ({
        field: issue.path.join('.') || 'body',
        message: issue.message,
        code: issue.code,
      }));
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    const errorResponse: ResponseApi<any> = {
      status_code: status,
      message,
      ...(errors ? { errors } : {}),
    };

    response.status(status).json(errorResponse);
  }
}
