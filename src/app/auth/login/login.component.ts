import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    // no need selector <app-login></app-login> because we will load it via routing
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    isLoading =  false;

    constructor(public authService: AuthService) {
    }

    onLogin(form: NgForm) {
        console.log(form);
        if (form.invalid) {
            return;
        }
        this.authService.loginUser(form.value.email, form.value.password);
    }
}
