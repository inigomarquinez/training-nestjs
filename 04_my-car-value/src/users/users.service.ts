import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {} // @InjectRepository will tell the Dependeny Injection system that we need the User Repository

  create(email: string, password: string) {
    // We create the user instance instead of saving it directly to the database
    // just in case we want to run some validation logic defined in the User entity before saving it.
    // Another example would be that by creating the instance, hooks defined in the User entity will be executed.
    const user = this.repo.create({ email, password });

    // If we use the save method directly with a plain object instead of an Entity instance, validation or hooks won't be executed.
    // return this.repo.save({ email, password});

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOne(id);
  }

  find(email: string) {
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findeOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, attrs);

    return this.repo.save(user); // hooks called!!!

    // If we used `update(plainObject)` instead of `save(Entity)`, the hooks wouldn't be triggered.
    // On the other hand, it would be a one-trip to the database.
    // return this.repo.update(id, attrs);
  }

  async remove(id: number) {
    const user = await this.findeOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    return this.repo.remove(user); // hooks called!!!

    // If we used `delete(plainObject)` instead of `remove(Entity)`, the hooks wouldn't be triggered.
    // On the other hand, it would be a one-trip to the database.
    // return this.repo.delete(id);
  }
}
