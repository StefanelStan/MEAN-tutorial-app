import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    // no need selector <app-login></app-login> because we will load it via routing
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

    isLoading =  false;
    private authSubscription: Subscription;

    constructor(public authService: AuthService) {
    }

    ngOnInit(): void {
        this.authSubscription = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
            this.isLoading = false;
        });
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }


    onLogin(form: NgForm) {
        console.log(form);
        if (form.invalid) {
            return;
        }
        this.isLoading = true;
        this.authService.loginUser(form.value.email, form.value.password);
    }
}
