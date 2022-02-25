import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }

  /*
   * Recommendation of NestJS docs to avoid sending fields marked as @Exclude() in the user entity:
   *
   * @UseInterceptors(ClassSerializerInterceptor)
   * 
   * Downside: if we have two different route handlers (one for admin and one public) that should return a different
   * amount of properties for a user entity, this solution won't work. It doesn't scale properly.
   * 
   * Alternative: create a custom interceptor (similar to middleware) => SerializeInterceptor wrapped in a custom decorator
   */
  @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) { // every single part of the URL is a string! We'll need to parse the id into a number
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
