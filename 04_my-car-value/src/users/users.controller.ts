import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  Session
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
/**
 * Two ways off adding the CurrentUserInterceptor to the controller:
 * 
 * 1. Controller scoped (downside: we need to manually add it to all the controllers that need the interceptor):
 * @UseInterceptors(CurrentUserInterceptor)
 * 
 * 2. Globaly scoped (downside: perhaps there are controllers that don't need it but anyway they will run it)
 * 
 * In both cases, we need to add it in the users module.
 */
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) {}

  // @Get('/whoami')
  // async whoAmI(@Session() session: any) {
  //   const user = await this.usersService.findOne(session.userId);
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }

  //   return user;
  // }

  @Get('/whoami')
  async whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  /*
   * Recommendation of NestJS docs to avoid sending fields marked as @Exclude() in the user entity:
   *
   * @UseInterceptors(ClassSerializerInterceptor)
   * 
   * Downside: if we have two different route handlers (one for admin and one public) that should return a different
   * amount of properties for a user entity, this solution won't work. It doesn't scale properly.
   * 
   * Alternative: create a custom interceptor (SerializeInterceptor) =>  wrap in a custom decorator (Serialize) => apply to all routes (controller level)
   */
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
