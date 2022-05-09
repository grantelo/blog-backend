import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CreateMessageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    
    console.log(req.user.id);
    console.log(req.query.dialogId);
    

    req.body.userId = req.user.id
    req.body.dialogId = req.query.dialogId

    return next.handle();
  }
}
