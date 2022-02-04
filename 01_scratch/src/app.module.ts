import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";

// Whenever our app starts up, nest is going to look at this app module,
// it's going to find all the controllers listed at `controllers` property
// and it's going to automatically create an instance of all our different controller classes
@Module({
  controllers: [AppController]
})
export class AppModule {}
