import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        // PostList/ Create Components will be imported via postsModule
        // LoginComponent & SignupComponent will be imported via AuthModule
        ErrorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        // angular mat modules/imports moved to angular-material.module
        AngularMaterialModule,
        PostsModule
        // AuthModule commented as this gets loaded dymaically by the router
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }],
    // multi = true -> we tell Angular not to override others but to use this one as well
    bootstrap: [AppComponent],
    entryComponents: [ErrorComponent]
})
export class AppModule { }
