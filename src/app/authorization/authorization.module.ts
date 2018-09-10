import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { ChangePasswordComponent } from './changePassword/changePassword.component';
import { Routes, RouterModule } from '@angular/router';
import { NgBootstrapModule } from '../ng-bootstrap.module';

const routes: Routes = [
  { path: '', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'changePassword', component: ChangePasswordComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    NgBootstrapModule
    ReactiveFormsModule
  ],
  declarations: [LoginComponent, ChangePasswordComponent]
})
export class AuthorizationModule { }
