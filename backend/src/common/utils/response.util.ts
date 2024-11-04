import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

export interface ApiResponse<T = any> {
  statusCode: number;
  error?: string | null;
  data?: T | null;
  message?: string;
}

export function createResponse<T>(
  statusCode: number,
  data: T | null = null,
  error: string | null = null,
  message?: string,
): ApiResponse<T> {
  return {
    data,
    error,
    message: message || (statusCode === HttpStatus.OK ? 'Success' : 'Error'),
    statusCode,
  };
}
