import { Router, RouterModule } from '@angular/router';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadCrumbComponent, DynamicFormComponent, DynamicInlineFormComponent, FieldButtonComponent, FieldColorComponent, FieldDocumentComponent, FieldImageComponent, FieldSelectComponent, FieldTextComponent, ModalConfirmComponent, NavigationTreeComponent, ResetPasswordComponent, SearchApplicationComponent, SidebarComponent, SplashScreenComponent } from '..';
import { NotifierModule } from 'angular-notifier';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClearInputDirective } from '../../directives/clear-input.directive';
import { FocusInputDirective } from '../../directives/focus-input.directive';
import { ApplicationPathPipe } from '../../pipes/application-path.pipe';
import { ComingSoonComponent } from '../coming-soon/coming-soon.component';
import { DynamicFieldDirective } from '../dynamic-form/directives';
import { FieldPasswordComponent } from '../dynamic-form/fields/field-password/field-password.component';
import { FieldToggleButtonComponent } from '../dynamic-form/fields/field-toggle-button/field-toggle-button.component';
import { ApplicationFormModalComponent } from '../navigation-tree/application-form-modal/application-form-modal.component';
import { ApplicationGroupFormModalComponent } from '../navigation-tree/application-group-form-modal/application-group-form-modal.component';
import { CKEditorModule } from 'ckeditor4-angular';
import { ColorPickerModule } from 'ngx-color-picker';
import { provideMockStore } from '@ngrx/store/testing';
import { State } from '@forge/core';
import { HighlightSearchDirective } from '../search-application/highlight-search.directive';

describe('BreadCrumbComponent', () => {
  let fixture: ComponentFixture<BreadCrumbComponent>;
  let component: BreadCrumbComponent;
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

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState })],
      declarations: [
        SearchApplicationComponent,
        DynamicFieldDirective,
        HighlightSearchDirective,
        FocusInputDirective,
        ClearInputDirective,
        SidebarComponent,
        SplashScreenComponent,
        DynamicFormComponent,
        DynamicInlineFormComponent,
        FieldButtonComponent,
        FieldTextComponent,
        FieldSelectComponent,
        FieldImageComponent,
        FieldDocumentComponent,
        FieldColorComponent,
        BreadCrumbComponent,
        NavigationTreeComponent,
        FieldPasswordComponent,
        FieldToggleButtonComponent,
        ModalConfirmComponent,
        ResetPasswordComponent,
        ComingSoonComponent,
        ApplicationFormModalComponent,
        ApplicationGroupFormModalComponent,
        ApplicationPathPipe,
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        NotifierModule,
        HttpClientModule,
        CommonModule,
        NgBootstrapModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ColorPickerModule,
        CKEditorModule
      ],
    });

    router = TestBed.get(Router);
    spyOnProperty(router, 'url').and.callFake(() => { return "/tenant/5/content/group/8"});
    fixture = TestBed.createComponent(BreadCrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('getApplicationLink should return current updated link', () => {
    var link = component.getApplicationLink(1);
    expect(link).toBe("/tenant/1/content/group/8");
  });

  afterEach(() => {
    fixture.destroy();
  });
});
