import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ErrorInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('interceptor');
    return next.handle(req);
      // .pipe(
      //   tap((event: HttpEvent<any>) => {
      //     if (event instanceof HttpResponse) {
      //       console.log(event);
      //     }
      //   }, (err: any) => {
      //     if (err instanceof HttpErrorResponse) {
      //       console.log(err);
      //       if ((err.status === 401) || (err.status === 403)) {
              
      //       }
      //     }
      //   })
        // map((response) => {
        //   console.log(response);
        //   return response;
        // }),
        // catchError(error => {
        //   console.log('error interceptered', error);
        //   switch (error.code) {
        //     case ('auth/user-not-found'):

        //     break;
        //     case ('auth/wrong-password'):
  
        //       break;
        //     case ('auth/invalid-email'):

        //     break;
        //     case ('auth/email-already-in-use'):

        //     break;
        //     default:

        //   }
          
        //   throw error;
        // })
      // );
  }
}
