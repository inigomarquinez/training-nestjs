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
});
