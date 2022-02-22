import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // make sure that incoming requests don't have extraneous properties in the body that we're not expecting
    }),
  );
  await app.listen(3000);
}
bootstrap();
