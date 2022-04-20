import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', () => {
    const signupEmail = 'test2@test.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: signupEmail, password: 'password' })
      .expect(201)
      .then(({ body }) => {
        const { id, email } = body;
        expect(id).toBeDefined();
        expect(email).toEqual(signupEmail);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'test2@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then(({ body }) => {
        const { email } = body;
        expect(email).toEqual(email);
      });
  });
});
