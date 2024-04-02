import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { corsOptions } from "./config";
import { MyLoggerService } from './my-logger/my-logger.service';
import { AllExceptionsFilter } from 'all-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });

  const { httpAdapter } = app.get(HttpAdapterHost)
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  // app.useLogger(app.get(MyLoggerService))

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
