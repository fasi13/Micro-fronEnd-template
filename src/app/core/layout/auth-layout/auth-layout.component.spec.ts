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
import { State } from 'src/app/core/store/store.reducers';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReadAvailableCulturesAction } from '../../store/culture';
import { PageNotFoundComponent } from 'src/app/error/page-not-found/page-not-found.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthLayoutComponent', () => {
  let fixture: ComponentFixture<AuthLayoutComponent>;
  let component: AuthLayoutComponent;
  let store: MockStore<State>;
  let router: Router;
  const initialState: State = {
    authorization: { authenticated: null, loaded: false, loading: false },
    router: { state: null, navigationId: null },
    application: {
      current: {
        info: null,
        branding: null,
        loading: false,
      },
      search: {
        data: null,
        loading: false,
      },
      types: {
        data: null,
        loading: false,
      },
      path: {
        data: null,
        loading: false,
      },
      preview: {
        branding: null,
        loading: false,
      },
    },
    content: {
      groups: {
        loading: false,
        items: null,
      },
      group: {
        loading: false,
        data: null,
      },
      content: {
        loading: false,
        data: null,
      },
      record: {
        loading: false,
        error: null,
      },
      action: {
        loading: false,
        error: null,
      },
      contentGroup: {
        loading: false,
        error: null,
      },
    },
    report: {
      audit: {
        loading: false,
        items: null,
        filters: null,
        sort: null,
      },
    },
    resetPassword: {
      resetPassword: {
        loading: false,
        error: null,
      },
    },
    culture: {
      availableCultures: ['en-US'],
      currentCulture: 'en-US'
    },
    user: {
      users: {
        loading: false,
        items: null,
        error: null,
      },
      user: {
        loading: false,
        data: null,
        error: null,
      },
      roles: {
        loading: false,
        items: null,
        error: null,
        selected: {
          loading: true,
        },
      },
    },
  };

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
              data: {hideLanguageSelector:true}
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
      declarations: [AuthLayoutComponent, PageNotFoundComponent],
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
    router.navigate(["/a/b"]).then(() => {
      expect(component.hideLanguageSelector).toBe(true);
      done();
    });
  });

  it('language selector should be shown', (done) => {
    router.navigate(["/a/c"]).then(() => {
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


  // it('should not update current culture when null', (done) => {
  //   store.dispatch(
  //     new ReadCultureSuccessAction({ currentCulture: null })
  //   );
  //   expect(component.currentCulture).toEqual(
  //     initialState.culture.currentCulture
  //   );
  //   done();
  // });

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
