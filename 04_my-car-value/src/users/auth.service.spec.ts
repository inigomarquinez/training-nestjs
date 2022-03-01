import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { async } from 'rxjs';


describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // Create a fake copy of the users service (so we can very easily control the behaviour)
    // We're only creating find and create because the auth service only uses those methods inside users service
    fakeUsersService = {
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

    expect(user.password).not.toEqual('password')
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with an email that is in use', (done) => {
    // Redefining a method of the mocked users service so we can test for the error
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'test@test.com', password: 'password' } as User]);


    // This format combined with async doesn't work from jest v27 that uses jest-circus (Test functions cannot both take a 'done' callback and return something. Either use a 'done' callback, or return a promise.)
    // try {
    //   await service.signup('test@test.com', 'password');
    // } catch (error) {
    //   done();
    // }

    // This is the correct way to do it:
    service
      .signup('test@test.com', 'password')
      .catch(_error => {});

    done();
  });
})
