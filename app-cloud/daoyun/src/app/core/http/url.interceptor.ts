import { Injectable } from "@angular/core";
import { HttpEvent, HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";

import { Observable } from "rxjs";
import { HttpService } from "src/app/services/http.service";

@Injectable()
export class UrlInterceptor implements HttpInterceptor {
  constructor(
    private httpservice: HttpService) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let url = request.url;
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      url = this.httpservice.ip + url;
    }
    console.log(url);
    const newRequest = request.clone({ url });
    return next.handle(newRequest);
  }
}