import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessagesRepository } from './messages.repository';
import { MessagesService } from './messages.service';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository] // things that will be used as dependencies for other classes
})

export class MessagesModule {}
