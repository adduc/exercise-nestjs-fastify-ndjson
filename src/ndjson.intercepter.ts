import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { FastifyReply } from 'fastify';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  /**
   * @see http://ndjson.org/
   */
  @Injectable()
  export class NDJSONInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const response = context.switchToHttp().getResponse<FastifyReply>();
      return next.handle().pipe(this.process(response));
    }
  
    process(response: any) {
      return map(function (data: any) {
        if (!(data instanceof Array)) {
          return data;
        }
  
        const chunkSize = 1000;
  
        if (data.length < chunkSize) {
          return data;
        }
  
        const result = [];
  
        for (let i = 0; i < data.length; i += chunkSize) {
          result.push(JSON.stringify(data.slice(i, i + chunkSize)));
        }
  
        
        response
          .type('application/x-ndjson')
          .send(result.join('\n'));
      });
    }
  }
  