import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [SidebarComponent, SplashScreenComponent],
  exports: [SidebarComponent, SplashScreenComponent]
})
export class SharedModule { }
