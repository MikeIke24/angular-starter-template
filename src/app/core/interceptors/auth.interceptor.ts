import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

import {NotificationService} from '../notification/notification.service';

export const InterceptorSkipHeader = 'X-Skip-Interceptor';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private notificationService: NotificationService
  ) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req.clone()).pipe(
      retry(1),
      catchError((error: HttpErrorResponse) => {
        if (!!error && !!error.error && !!error.error.message) {
          const splitMessage = error.error.message.split('content:');
          return throwError(!!splitMessage[1] ? splitMessage[1] : splitMessage);
        }
        if (error.status === 422) {
          throwError(error);
        }
        const errMsg =
          `System error occurred. Please try again later.`;
        this.notificationService.error(errMsg);
        return throwError(errMsg);
      })
    );
  }
}
