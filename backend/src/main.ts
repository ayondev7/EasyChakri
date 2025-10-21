/**
 * MAIN.TS - NestJS Bootstrap File
 * 
 * EXPRESS EQUIVALENT: server.js where you do app.listen()
 * 
 * KEY DIFFERENCES:
 * - Express: const app = express(); app.listen(PORT)
 * - NestJS: NestFactory.create() bootstraps the entire application
 * - NestJS uses decorators and dependency injection throughout
 * - All middleware, pipes, guards are configured here globally
 */

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  // Create NestJS application instance
  // Similar to: const app = express();
  const app = await NestFactory.create(AppModule);

  // Enable CORS - Similar to Express cors() middleware
  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  });

  // Global API prefix - all routes will be prefixed with /api
  // Express equivalent: app.use('/api', router)
  app.setGlobalPrefix('api');

  // Global Validation Pipe - automatically validates DTOs
  // Express equivalent: manual validation in each route with express-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip properties that don't have decorators
      forbidNonWhitelisted: true, // Throw error if extra properties are sent
      transform: true, // Automatically transform payloads to DTO instances
      transformOptions: {
        enableImplicitConversion: true, // Convert types automatically
      },
    }),
  );

  // Global Exception Filter - standardizes error responses
  // Express equivalent: app.use(errorHandler) at the end
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global Response Interceptor - standardizes success responses
  // Express equivalent: custom responseHandler middleware
  app.useGlobalInterceptors(new ResponseInterceptor());

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`🚀 Server is running on http://localhost:${port}`);
}

bootstrap();
