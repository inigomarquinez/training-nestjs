import {
  createParamDecorator,
  ExecutionContext
} from '@nestjs/common';

// We can't use Dependency Injection in a decorator, so we need to create an interceptor (CurrentUserInterceptor)
// to get the user from the session + the database, and send it to the decorator through the request object.
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  }
);
