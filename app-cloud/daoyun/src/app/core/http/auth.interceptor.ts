import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";

import { Observable } from "rxjs";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authToken = 'my-authorization-token';
    const authReq = request.clone({
      headers: request.headers.set('Authorization', authToken)
    });
    console.log("new headers", authReq.headers.keys());
    return next.handle(request);
  }
}