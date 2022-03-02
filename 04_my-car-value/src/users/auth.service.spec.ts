import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service (so we can very easily control the behaviour)
    // We're only creating find and create because the auth service only uses those methods inside users service
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = { id: Math.floor(Math.random() * 999999), email, password } as User;
        users.push(user);
        return Promise.resolve(user);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // This is how we inject the fake users service:
        // If anyone asks for UsersService, we'll return the fakeUserService
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@test.com', 'password');

    // The returned password is salted and hashed
    expect(user.password).not.toEqual('password')
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws if user signs up with an email that is in use', async () => {
    // BEFORE the refactor to use intelligent mocks:
    // Redefining a method of the mocked users service so we can test for the error
    // We need the users service find method to return a non-empty array to mock that there is already a user with a given email
    // fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'test@test.com', password: 'password' } as User]);

    // AFTER the refactor to use intelligent mocks:
    await service.signup('test@test.com', 'password');

    // From jest v27 using jest-circus => test functions cannot both take a 'done' callback and return something. Either use a 'done' callback, or return a promise.
    // @see https://jestjs.io/es-ES/docs/asynchronous#asyncawait
    expect.assertions(1);

    try {
      await service.signup('test@test.com', 'password');
    } catch (error) {
      expect(error.message).toMatch(/email already in use/i);
    }
  });

  it('throws if signin is called with an unused email', async () => {
    expect.assertions(1);

    try {
      await service.signin('test@test.com', 'password');
    } catch (error) {
      expect(error.message).toMatch(/user not found/i);
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signup('test@test.com', 'password');

    expect.assertions(1);

    try {
      await service.signin('test@test.com', 'wrong-password');
    } catch (error) {
      expect(error.message).toMatch(/invalid password/i);
    }
  });

  it('returns a user if correct password is provided', async() => {
    await service.signup('test@test.com', 'password');
    const user = await service.signin('test@test.com', 'password');
    expect(user).toBeDefined();
  });
})
