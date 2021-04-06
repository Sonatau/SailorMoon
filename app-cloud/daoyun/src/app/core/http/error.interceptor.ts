import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from 'rxjs/operators';
import { HttpService } from "src/app/services/http.service";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private httpservice: HttpService) { }
  
  handleError(error: HttpErrorResponse): Observable<any> {
    console.log('handleError');
    switch (error.status) {
      case 200:
        break;
      case 401:
        break;
      case 404:
        break;
      case 403:
        break;
      case 500:
        break;
      default:
        break;
    }
    return of(error);
  }
    
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }
}