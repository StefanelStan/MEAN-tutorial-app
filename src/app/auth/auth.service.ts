import { Injectable } from '@angular/core';

import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
    constructor(private httpClient: HttpClient) {
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
        this.httpClient.post('http://localhost:3000/api/user/login', authData)
            .subscribe((response) => {
                console.log(response);
            });
    }
}
