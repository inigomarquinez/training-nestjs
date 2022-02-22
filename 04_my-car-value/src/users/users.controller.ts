import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
export class UsersController {
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto): Promise<any> {
    console.log('body :>> ', body);
    return body;
  }
}
