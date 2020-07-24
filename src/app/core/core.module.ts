import { CultureEffects } from './store/culture/culture.effects';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthLayoutComponent } from './layout';
import { UserService } from './services/user.service';
import { AuthorizationEffects } from './store/authorization';
import { ApplicationEffects } from './store/application';
import {
  FgeReducers,
  clearStateOnLogout,
  clearStoredData
} from './store/store.reducers';
import { RouterEffects } from './store/router';
import { loadFromLocalStorage } from './store/util';
import { httpInterceptorProviders } from './interceptors';
import { SharedModule } from '../shared/shared.module';
import { ContentEffects } from './store/content';
import {
  ContentService,
  FgeRouterService,
  FgeModalService,
  FgeHttpActionService,
  FgeNotificationService
} from './services';
import { UserEffects } from './store/user';
import { ResetPasswordEffects } from './store/reset-password';
import { TenantLayoutComponent } from './layout/tenant-layout/tenant-layout.component';
import { ApplicationLoaderComponent } from './layout/application-loader/application-loader.component';
import { ReportEffects } from './store/report';

import { CultureService } from './services/culture.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forRoot(FgeReducers, {
      initialState: loadFromLocalStorage,
      metaReducers: [clearStateOnLogout, clearStoredData]
    }),
    StoreRouterConnectingModule.forRoot(),
    EffectsModule.forRoot([
      AuthorizationEffects,
      ApplicationEffects,
      RouterEffects,
      ContentEffects,
      UserEffects,
      ResetPasswordEffects,
      ReportEffects,
      
      CultureEffects
    ]),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    }),
    SharedModule
  ],
  declarations: [
    AuthLayoutComponent,
    TenantLayoutComponent,
    ApplicationLoaderComponent
  ],
  exports: [ApplicationLoaderComponent],
  providers: [
    UserService,
    ContentService,
    FgeHttpActionService,
    FgeNotificationService,
    FgeRouterService,
    FgeModalService,
    CultureService,
    httpInterceptorProviders,

  ]
})
export class CoreModule {}
