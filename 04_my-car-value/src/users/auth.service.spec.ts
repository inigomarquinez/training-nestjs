import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';

it('can create an instance of auth service', async () => {
  // Create a fake copy of the users service (so we can very easily control the behaviour)
  const fakeUserService = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) => Promise.resolve({ id: 1, email, password }),
  };

  const module = await Test.createTestingModule({
    providers: [
      AuthService,
      // This is how we inject the fake users service:
      // If anyone asks for UsersService, we'll return the fakeUserService
      {
        provide: UsersService,
        useValue: fakeUserService
      }
    ]
  }).compile();

  const service = module.get(AuthService);

  expect(service).toBeDefined();
})