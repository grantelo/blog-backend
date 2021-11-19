import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import {BadRequestException, ValidationPipe} from "@nestjs/common";
import {log} from "util";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({exceptionFactory: (errors) => new BadRequestException(errors.map(item => {
      return {
        [item.property]: Object.values(item.constraints)
      }
    }))}));
  app.use(cookieParser())
  app.enableCors({origin: "http://localhost:3000", credentials: true});

  await app.listen(5000);
}
bootstrap();
