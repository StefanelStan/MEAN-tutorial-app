import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userIsAuthenticated = false;
    private authSubscription: Subscription;

    constructor(private authService: AuthService) {
    }

    ngOnInit(): void {
        this.userIsAuthenticated = this.authService.getAuthStatus();
        this.authSubscription =  this.authService.getAuthStatusListener()
            .subscribe((authStatus: boolean) => {
                this.userIsAuthenticated = authStatus;
            });
    }

    ngOnDestroy(): void {
        this.authSubscription.unsubscribe();
    }

    onLogout(): void {
        this.authService.logout();
    }
}
