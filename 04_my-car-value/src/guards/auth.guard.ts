import { CanActivate, ExecutionContext } from "@nestjs/common";

/**
 * With this guard we want to reject the request if the user is not logged in.
 * 
 * If the guard returns 'false' it will automatically send a 403 (Forbidden).
 */
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}