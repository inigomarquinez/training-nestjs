import { Body, Controller, Get, Param, Post, NotFoundException } from '@nestjs/common';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('/messages')
export class MessagesController {
  constructor(public messagesService: MessagesService) {
    // Controller is creating its own dependencies
    // DON'T DO THIS ON A REAL APP!
    // this.messagesService = new MessagesService();
    // USE DEPENDENCY INJECTION INSTEAD! (INVERSION OF CONTROL PRINCIPLE)
  }

  @Get()
  listMessages() {
    return this.messagesService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    return this.messagesService.create(body.content);
  }

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    const message = await this.messagesService.findOne(id);

    if (!message) {
      throw new NotFoundException(`message with id ${id} not found`);
    }

    return message;
  }
}
