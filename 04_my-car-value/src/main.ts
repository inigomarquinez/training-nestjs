import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Instead of appying them here, we move cookieSession and ValidationPipe to our app.module.ts so we can use them in our e2e tests
  // app.use(cookieSession({
  //   keys: ['ajhakhahsaj'] // used to encrypt the cookie
  // }));

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // make sure that incoming requests don't have extraneous properties in the body that we're not expecting
  //   }),
  // );

  await app.listen(3000);
}
bootstrap();
