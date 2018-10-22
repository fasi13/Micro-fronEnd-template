import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { SearchApplicationComponent } from './components/search-application/search-application.component';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgBootstrapModule,
    RouterModule
  ],
  declarations: [
    SidebarComponent,
    SplashScreenComponent,
    SearchApplicationComponent
  ],
  exports: [
    SidebarComponent,
    SplashScreenComponent,
    SearchApplicationComponent
  ]
})
export class SharedModule { }
