import {
  CultureAction,
  CultureActionTypes,
  ReadAvailableCulturesSuccessAction,
  ReadCultureAction,
  SwitchCultureAction,
  ResetCultureAction,
  ReadCultureSuccessAction,
} from './../../store/culture/culture.actions';
import { AuthLayoutComponent } from './auth-layout.component';
import { RouterModule } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State } from 'src/app/core/store/store.reducers';
import { CoreModule } from '../../core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReadAvailableCulturesAction } from '../../store/culture';

describe('AuthLayoutComponent', () => {
  let fixture: ComponentFixture<AuthLayoutComponent>;
  let component: AuthLayoutComponent;
  let store: MockStore<State>;
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

    culture: { availableCultures: ['en-US'], currentCulture: 'en-US' },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [AuthLayoutComponent],
      imports: [
        NotifierModule,
        HttpClientModule,

        CommonModule,
        SharedModule,
        NgBootstrapModule,
        RouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
      ],
    });

    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();
    fixture = TestBed.createComponent(AuthLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch an action to load data when created', () => {
    expect(store.dispatch).toHaveBeenCalledWith(
      new ReadAvailableCulturesAction()
    );
    expect(store.dispatch).toHaveBeenCalledWith(new ReadCultureAction());
  });

  it('should dispatch an action to switch Culture', () => {
    component.setContentCulture('fr-CA');
    expect(store.dispatch).toHaveBeenCalledWith(
      new SwitchCultureAction({ cultureCode: 'fr-CA' })
    );
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


  it('should not update current cultures when falsy ', (done) => {
    store.dispatch(
      new ReadCultureSuccessAction({ currentCulture: null })
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
