import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthLayoutComponent, UnauthLayoutComponent } from './layout';
import { UserService } from './services/user.service';
import { AuthorizationEffects } from './store/authorization';
import { ApplicationEffects } from './store/application';
import { FgeReducers, clearStateOnLogout } from './store/store.reducers';
import { RouterEffects } from './store/router';
import { loadFromLocalStorage } from './store/util';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor, UnauthorizedInterceptor, ProxyApiInterceptor } from './interceptors';
import { SharedModule } from '../shared/shared.module';
import { ContentEffects } from './store/content';
import { ContentService, FgeRouterService, ObjectTransactionService } from './services';
import { UserEffects } from './store/user';
import { ResetPasswordEffects } from './store/reset-password';
import { TenantLayoutComponent } from './layout/tenant-layout/tenant-layout.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(FgeReducers, {
      initialState: loadFromLocalStorage,
      metaReducers: [
        clearStateOnLogout
      ]
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AuthorizationEffects,
      ApplicationEffects,
      RouterEffects,
      ContentEffects,
      UserEffects,
      ResetPasswordEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25,
    }),
    SharedModule,
  ],
  declarations: [
    AuthLayoutComponent,
    UnauthLayoutComponent,
    TenantLayoutComponent
  ],
  exports: [
    AuthLayoutComponent,
    UnauthLayoutComponent
  ],
  providers: [
    UserService,
    ContentService,
    ObjectTransactionService,
    FgeRouterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ProxyApiInterceptor,
      multi: true
    }, {
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
