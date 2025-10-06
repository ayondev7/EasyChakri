/**
 * RESPONSE INTERCEPTOR - Standardizes Success Responses
 * 
 * EXPRESS EQUIVALENT: Custom middleware that wraps responses
 * app.use((req, res, next) => { res.success = (data) => res.json({...}) })
 * 
 * KEY DIFFERENCES:
 * - NestJS: Uses Interceptors that can transform responses
 * - Automatically applied to all routes via app.useGlobalInterceptors()
 */

import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        // If data already has our structure, return as is
        if (data && typeof data === 'object' && 'success' in data) {
          return data as ApiResponse<T>;
        }

        // Otherwise, wrap it in our standard structure
        return {
          success: true,
          message: data?.message || 'Operation successful',
          data: data?.data || data,
          ...(data?.meta && { meta: data.meta }),
        };
      }),
    );
  }
}
