import {
  ReadAvailableCulturesSuccessAction,
  ReadCultureAction,
  SwitchCultureAction,
  ResetCultureAction,
  ReadCultureSuccessAction,
} from './../../store/culture/culture.actions';
import { AuthLayoutComponent } from './auth-layout.component';
import { Router, RouterModule, Routes } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReadAvailableCulturesAction } from '../../store/culture';
import { PageNotFoundComponent } from 'src/app/error/page-not-found/page-not-found.component';
import { RouterTestingModule } from '@angular/router/testing';
import { TimeoutComponent } from '../../session/timeout.component';
import { AppConfigService } from 'src/app/app-config.service';

describe('AuthLayoutComponent', () => {
  let fixture: ComponentFixture<AuthLayoutComponent>;
  let component: AuthLayoutComponent;
  let store: MockStore<State>;
  let router: Router;
  const initialState: State = TestInitialState;

  const routes: Routes = [
    {
      path: '',
      component: PageNotFoundComponent,
      children: [
        {
          path: 'a',
          component: PageNotFoundComponent,
          children: [
            {
              path: 'b',
              component: PageNotFoundComponent,
              data: {hideLanguageSelector: true}
            },
            {
              path: 'c',
              component: PageNotFoundComponent
            }
          ]
        }
      ]
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [AuthLayoutComponent, PageNotFoundComponent, TimeoutComponent],
      imports: [
        NotifierModule,
        HttpClientModule,
        CommonModule,
        SharedModule,
        NgBootstrapModule,
        RouterTestingModule.withRoutes(routes),
        FormsModule,
        ReactiveFormsModule,
      ],
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    const appConfig = TestBed.get(AppConfigService);
    spyOnProperty(appConfig, 'config', 'get').and.returnValue({});
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('language selector should be hidden', (done) => {
    router.navigate(['/a/b']).then(() => {
      expect(component.hideLanguageSelector).toBe(true);
      done();
    });
  });

  it('language selector should be shown', (done) => {
    router.navigate(['/a/c']).then(() => {
      expect(component.hideLanguageSelector).toBe(false);
      done();
    });
  });

  it('should dispatch an action to load data when created', (done) => {
    expect(store.dispatch).toHaveBeenCalledWith(
      new ReadAvailableCulturesAction()
    );
    expect(store.dispatch).toHaveBeenCalledWith(new ReadCultureAction());
    done();
  });

  it('should dispatch an action to switch Culture', (done) => {
    component.setContentCulture('fr-CA');
    expect(store.dispatch).toHaveBeenCalledWith(
      new SwitchCultureAction({ cultureCode: 'fr-CA' })
    );
    done();
  });

  it('should dispatch an action to reset Culture', (done) => {
    component.onLogoutClicked(new Event('type'));
    expect(store.dispatch).toHaveBeenCalledWith(new ResetCultureAction());
    done();
  });

  it('should not update available cultures when null or empty', (done) => {
    store.dispatch(
      new ReadAvailableCulturesSuccessAction({ availableCultures: [] })
    );
    store.dispatch(
      new ReadAvailableCulturesSuccessAction({ availableCultures: null })
    );
    expect(component.availableCultures).toEqual(
      initialState.culture.availableCultures
    );
    done();
  });


  it('should not update current culture when null', (done) => {
    store.dispatch(
      new ReadCultureSuccessAction({ currentCulture: null })
    );
    expect(component.currentCulture).toEqual(
      initialState.culture.currentCulture
    );
    done();
  });

  it('should not update current culture when same is returned', (done) => {
    store.dispatch(
      new ReadCultureSuccessAction({ currentCulture: initialState.culture.currentCulture })
    );
    expect(component.currentCulture).toEqual(
      initialState.culture.currentCulture
    );
    done();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
