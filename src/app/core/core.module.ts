import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from "@ngrx/effects";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { StoreModule } from "@ngrx/store";
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

import { AuthLayoutComponent, UnauthLayoutComponent } from './layout';
import { UserService } from './services/user.service';
import { AuthorizationEffects } from './store/authorization';
import { ApplicationEffects } from './store/application';
import { FgeReducers } from './store/store.reducers';
import { RouterEffects } from './store/router';
import { loadFromLocalStorage } from './store/util';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor, UnauthorizedInterceptor } from './interceptors';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    NgbModule.forRoot(),
    ReactiveFormsModule,
    StoreModule.forRoot(FgeReducers, {
      initialState: loadFromLocalStorage()
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([AuthorizationEffects, ApplicationEffects, RouterEffects]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
  ],
  declarations: [
    AuthLayoutComponent,
    UnauthLayoutComponent
  ],
  exports: [
    AuthLayoutComponent,
    UnauthLayoutComponent
  ],
  providers: [
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }, {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    }
  ]
})
export class CoreModule { }
