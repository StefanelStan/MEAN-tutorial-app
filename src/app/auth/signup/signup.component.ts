import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    // no need selector <app-login></app-login> because we will load it via routing
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent {
    isLoading =  false;

    constructor(public authService: AuthService) {
    }

    onSignup(form: NgForm) {
        console.log(form);
        if (form.invalid) {
            return;
        } else {
            this.isLoading = true;
            this.authService.createUser(form.value.email, form.value.password);
            this.isLoading =  false;
        }
    }
}
