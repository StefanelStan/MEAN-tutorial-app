import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', component: PostListComponent },
    { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:postId', component: PostCreateComponent, canActivate: [AuthGuard] },
    // the login and signup will be managed by AuthRoutingModule childRouter
    // { path: 'login', component: LoginComponent },
    // { path: 'signup', component: SignupComponent }
    // We can't use /login because we already have /login, we can't have "" because we alredy have it
    { path: 'auth', loadChildren: './auth/auth.module#AuthModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AuthGuard] // add routing guard
})
export class AppRoutingModule {}
