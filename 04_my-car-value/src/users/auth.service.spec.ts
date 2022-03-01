import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

it('can create an instance of auth service', async () => {
  // Create a fake copy of the users service (so we can very easily control the behaviour)
  // We're only creating find and create because the auth service only uses those methods inside users service
  const fakeUserService: Partial<UsersService> = {
    find: () => Promise.resolve([]),
    create: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
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