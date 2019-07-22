import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable() // we need to inject 2 services into this service - alike
export class AuthGuard implements CanActivate {
    constructor(public authService: AuthService, private router: Router) {
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | Observable<boolean> | Promise<boolean> {
        // return false -> we we return false we want to also navigate the user to some other page else he will be stuck in loading
        // get the status/token/auth from authService and verify if can access or not
        const isAuth = this.authService.getAuthStatus();
        if (!isAuth) {
            // navigate away with the router
            this.router.navigate(['/auth/login']);
        }
        return isAuth;
    }
}
