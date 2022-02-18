import { Module } from '@nestjs/common';
import { PowerService } from './power.service';

@Module({
  providers: [PowerService],
  exports:[PowerService] // by default the service is private to the module, so we need to export it so it can be used in other modules
})
export class PowerModule {}
