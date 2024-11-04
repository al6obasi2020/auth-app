import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    this.logger.error(
      `Status: ${status}, Error: ${exception instanceof Error ? exception.name : 'UnknownError'}, Message: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    const responseBody = {
      statusCode: status,
      error: exception instanceof Error ? exception.name : 'UnknownError',
      message:
        typeof message === 'object' && 'message' in message
          ? Array.isArray(message.message)
            ? message.message.join('. ')
            : message.message
          : message,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(responseBody);
  }
}
