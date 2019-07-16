import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable() // this way we can inject services into our service: the authService
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {

    }

    intercept(request: HttpRequest<any>, next: HttpHandler) {
        // request: type any as we want to catch all of them,
        // next: as middleware, we want to allow the request to be continued/taken by the post, subscribe etc
        const token = this.authService.getToken(); // fetch token from authService
        // manipulate the request to inject/hold the token!
        // It is good to clone the request and not manipulate it directly due to internals/ possible errors/ side effects
        const requestClone = request.clone({
            // Bare in mind: on backend on middleware we do request.headers.authorization.split so we need to keep SAME NAME
            headers: request.headers.set('Authorization', 'Bearer ' + token)
        });
        return next.handle(requestClone);
    }
}
