import { Injectable } from '@angular/core';

import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private token: string;
    private tokenTimer: any;

    private authStatusListener = new Subject<boolean>();
    private isAuthenticated = false; // this will be called by components that were ngInit after the login process

    constructor(private httpClient: HttpClient, private router: Router) {
    }

    getToken() {
        return this.token;
    }

    getAuthStatus() { // for components that were ngInit after the login and missed the observer's first login tick
        return this.isAuthenticated;
    }

    // other components can subscribe to this listener when they initialize and be notified of any chance
    getAuthStatusListener() {
        return this.authStatusListener.asObservable();
    }

    createUser(email: string, password: string) {
        const authData: AuthData = {email, password};
        this.httpClient.post('http://localhost:3000/api/user/signup', authData)
            .subscribe((response) => {
                console.log(response);
            });
    }

    loginUser(email: string, password: string) {
        const authData: AuthData = {email, password};
        this.httpClient.post<{token: string, expiresIn: number}>('http://localhost:3000/api/user/login', authData)
            .subscribe((response) => {
                // console.log(response);
                this.token = response.token;
                if (this.token) {
                    const expiredInDuration = response.expiresIn;
                    this.tokenTimer = setTimeout(() => { this.logout(); }, expiredInDuration * 1000); // set timer to variable to logout
                    this.isAuthenticated = true; // set this so other late-at-party components can read the status
                    this.authStatusListener.next(true); // we tell the observable that we changed to true and every1 listening will know
                    this.router.navigate(['/']); // if we have good token navigate to homepage
                }
            });
    }

    logout() {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }
}
