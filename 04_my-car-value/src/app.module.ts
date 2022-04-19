import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';

const cookieSession = require('cookie-session'); // We need to do a require due to our tsconfig

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      isGlobal: true,
    }),
    UsersModule,
    ReportsModule,
    // Without dependency injection:
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
    //   entities: [User, Report],
    //   // The synchronize feature of TypeORM will take care of updating the database schema.
    //   // ONLY USE IT IN DEVELOPMENT ENVIRONMENT!!!
    //   // In production, you should use migrations instead.
    //   synchronize: true
    // })
    // To be able to use dependency injection and use ConfigService:
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        }
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE, // every single requests that comes into our application
      useValue: new ValidationPipe({
        whitelist: true, // make sure that incoming requests don't have extraneous properties in the body that we're not expecting
      }),
    }
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: ['ajhakhahsaj'] // used to encrypt the cookie
    })).forRoutes('*'); // use the cookieSession middleware for every single request that comes into our application
  }
}
