import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ApplicationNotFoundComponent } from './application-not-found/application-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: 'notFound' },
  {
    path: 'application',
    component: ApplicationNotFoundComponent
  },
  {
    path: 'notFound',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
  ],
  declarations: [
    ApplicationNotFoundComponent,
    PageNotFoundComponent
  ]
})
export class ErrorModule { }
