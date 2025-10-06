/**
 * HTTP EXCEPTION FILTER - Standardizes Error Responses
 * 
 * EXPRESS EQUIVALENT: Error handling middleware at the end of your app
 * app.use((err, req, res, next) => { res.status(err.status).json({...}) })
 * 
 * KEY DIFFERENCES:
 * - NestJS: Uses Exception Filters for error handling
 * - Catches all HttpException errors and formats them consistently
 * - Applied globally via app.useGlobalFilters()
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface ErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: string | object;
  };
  meta?: {
    timestamp: string;
    path: string;
  };
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Parse error message and details
    let message = 'An error occurred';
    let details: string | object = '';

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    } else if (typeof exceptionResponse === 'object') {
      message = (exceptionResponse as any).message || message;
      details = (exceptionResponse as any).error || (exceptionResponse as any).message || '';
    }

    // Build standardized error response
    const errorResponse: ErrorResponse = {
      success: false,
      message,
      error: {
        code: this.getErrorCode(status),
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
        path: request.url,
      },
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Map HTTP status to error code
   */
  private getErrorCode(status: number): string {
    const codes = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
    };

    return codes[status] || 'UNKNOWN_ERROR';
  }
}
