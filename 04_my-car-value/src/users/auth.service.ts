import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // 1. See if email is in use
    const users = await this.usersService.find(email);
    if (users.length > 0) {
      throw new BadRequestException('email already in use');
    }

    // 2. Hash the user's password
    //   2.1. Generate a salt
    const salt = randomBytes(8).toString('hex');
    //   2.2. Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //   2.3. Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // 3. Create a new user and save it
    const user = await this.usersService.create(email, result);

    // 4. return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid password');
    }

    return user;
  }
}