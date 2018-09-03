import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login' },
  { path: 'login', component: LoginComponent }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule
  ],
  declarations: [LoginComponent]
})
export class AuthorizationModule { }
