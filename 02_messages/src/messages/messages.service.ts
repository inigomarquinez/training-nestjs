import { Injectable } from "@nestjs/common";
import { MessagesRepository } from "./messages.repository";

@Injectable()
export class MessagesService {
  constructor(public messagesRepo: MessagesRepository) { // by using `public` in the constructor, will be automatically assigned to the properties of the class
    // Service is creating its own dependencies
    // DON'T DO THIS ON A REAL APP!
    // this.messagesRepo = new MessagesRepository();
    // USE DEPENDENCY INJECTION INSTEAD! (INVERSION OF CONTROL PRINCIPLE)
  }

  async findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }

  async findAll() {
    return this.messagesRepo.findAll();
  }

  async create(content: string) {
    return this.messagesRepo.create(content);
  }
}
