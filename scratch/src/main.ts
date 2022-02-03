// Normally the module and the controller are in separate files,
// but for now we'll create the module and the controller inside the main file.addEventListener('
import { Controller, Get } from '@nestjs/common';

@Controller()
class AppController {
  @Get()
  getRootRoute() {
    return 'hi there!';
  }
}
