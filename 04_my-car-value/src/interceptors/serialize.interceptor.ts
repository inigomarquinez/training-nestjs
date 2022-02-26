import { CallHandler, ExecutionContext, NestInterceptor, UseInterceptors } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

// This is an interface that means any class
interface ClassConstructor {
  new (...args: any[]): {}
}

// Create a custom decorator (plain function) to wrap the interceptor functionality
export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // Run something before a request is handled by the request handler
    // console.log('I\'m running before the handler:', context);

    return handler.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        // console.log('I\'m running before response is sent out:', data);
        return plainToInstance(this.dto, data, { excludeExtraneousValues: true });
      }));
  }
}
