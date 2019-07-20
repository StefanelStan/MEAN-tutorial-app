import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ErrorComponent } from './error/error.component';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(public dialogService: MatDialog) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request)
            .pipe(
                catchError((error: HttpErrorResponse) => {
                    // console.log(error);
                    // will work on bad login and not error.error.error.message will work on signup mongoose adds its own error
                    // alert(error.error.error.message);
                    let errorMessage = 'An unknown error occured';
                    if  (error.error.message) {
                        errorMessage = error.error.message;
                    } else if (error.error.error.message) {
                        errorMessage = error.error.error.message;
                    }
                    this.dialogService.open(ErrorComponent, { data: { message: errorMessage } });
                    // this will clone & return httpResp that will be of type Error and we can detect this in components
                    return throwError(error);
                })
            ); // this gives back an observable and we can hook in and listen to events (http events/errors)
    }
}
