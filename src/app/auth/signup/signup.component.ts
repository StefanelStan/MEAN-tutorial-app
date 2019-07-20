import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    // no need selector <app-login></app-login> because we will load it via routing
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

    isLoading =  false;
    private authSubscription: Subscription;

    constructor(public authService: AuthService) {
    }

    ngOnInit(): void {
        this.authSubscription = this.authService.getAuthStatusListener().subscribe((authStatus: boolean) => {
            this.isLoading = false; // user logged in so we can stop loading spinner
        });
    }
    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }

    onSignup(form: NgForm) {
        console.log(form);
        if (form.invalid) {
            return;
        } else {
            this.isLoading = true;
            this.authService.createUser(form.value.email, form.value.password);
            // here I cannot know if the user is loggedIn or not .. to set isLoading = false;
            // what I need it to listen to a subscriber and inform me if logged or not..
        }
    }
}
