// Normally the module and the controller are in separate files,
// but for now we'll create the module and the controller inside the main file.addEventListener('
import { Controller, Module, Get } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

@Controller()
class AppController {
  @Get()
  getRootRoute() {
    return 'hi there!';
  }
}

// Whenever our app starts up, nest is going to look at this app module,
// it's going to find all the controllers listed at `controllers` property
// and it's going to automatically create an instance of all our different controller classes
@Module({
  controllers: [AppController]
})
class AppModule {}

async function bootstrap () {
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
}

bootstrap();
