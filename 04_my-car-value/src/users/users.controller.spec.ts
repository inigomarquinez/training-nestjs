import { Test, TestingModule } from '@nestjs/testing';

import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // We need to take a look at the users service and auth service methods used inside the users controller methods
    // we want to test in order to mock them
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'test@test.com', password: 'password' } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password'} as User
        ]);
      },
      // remove: () => {},
      // update: () => {},
    };

    fakeAuthService = {
      // signup: () => {},
      // signin: () => {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        // This is how we inject the mocked services:
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with the given email', async () => {
    const users = await controller.findAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('findUser returns a single user with the given id', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('findUser throws an error if user with the given id is not found', async () => {
    fakeUsersService.findOne = (id: number) => null;

    expect.assertions(1);

    try {
      await controller.findUser('1');
    } catch (error) {
      expect(error.message).toMatch(/user not found/i);
    }
  });
});
