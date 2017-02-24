import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent }  from './app.component';
import { ApplicationsModule } from './applications/applications.module';

const routes: Routes = [
    { path: '', redirectTo: '/applications', pathMatch: 'full' }
];

@NgModule({
  imports:      [ 
    BrowserModule,
    RouterModule.forRoot(routes),
    ApplicationsModule 
  ],
  exports: [RouterModule],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }
