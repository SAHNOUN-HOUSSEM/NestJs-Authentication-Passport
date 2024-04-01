import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { corsOptions } from "./config";
import { MyLogger } from './my-logger/my-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  });
  // app.useLogger(app.get(MyLogger))
  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors(corsOptions);
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000);
}
bootstrap();
