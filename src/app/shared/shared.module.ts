import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { SearchApplicationComponent } from './components/search-application/search-application.component';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from 'ckeditor4-angular';

import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { DynamicInlineFormComponent } from './components/dynamic-form/dynamic-inline-form/dynamic-inline-form.component';
import { FieldButtonComponent } from './components/dynamic-form/fields/field-button/field-button.component';
import { DynamicFieldDirective } from './components/dynamic-form/directives/dynamic-field.directive';
import { FieldTextComponent } from './components/dynamic-form/fields/field-text/field-text.component';
import { FieldSelectComponent } from './components/dynamic-form/fields/field-select/field-select.component';
import { FieldImageComponent } from './components/dynamic-form/fields/field-image/field-image.component';
import { FieldDocumentComponent } from './components/dynamic-form/fields/field-document/field-document.component';
import { FieldColorComponent } from './components/dynamic-form/fields/field-color/field-color.component';
import { FieldHtmlComponent } from './components/dynamic-form/fields/field-html/field-html.component';
import { BreadCrumbComponent } from './components/bread-crumb/bread-crumb.component';
import { NavigationTreeComponent } from './components/navigation-tree/navigation-tree.component';
import { HighlightSearchDirective } from './components/search-application/highlight-search.directive';
import { FieldPasswordComponent } from './components/dynamic-form/fields/field-password/field-password.component';
import { FieldToggleButtonComponent } from './components/dynamic-form/fields/field-toggle-button/field-toggle-button.component';
import { ModalConfirmComponent } from './components/modal-confirm/modal-confirm.component';
import { FocusInputDirective } from './directives/focus-input.directive';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { ClearInputDirective } from './directives/clear-input.directive';
import { ApplicationFormModalComponent } from './components/navigation-tree/application-form-modal/application-form-modal.component';
import {
  ApplicationGroupFormModalComponent
} from './components/navigation-tree/application-group-form-modal/application-group-form-modal.component';
import { ApplicationPathPipe } from './pipes/application-path.pipe';
import { ImageGalleryModalComponent } from './components/image-gallery-modal/image-gallery-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapModule,
    RouterModule,
    ColorPickerModule,
    CKEditorModule
  ],
  declarations: [
    DynamicFieldDirective,
    HighlightSearchDirective,
    FocusInputDirective,
    ClearInputDirective,

    SidebarComponent,
    SplashScreenComponent,
    SearchApplicationComponent,
    DynamicFormComponent,
    DynamicInlineFormComponent,
    FieldButtonComponent,
    FieldTextComponent,
    FieldSelectComponent,
    FieldImageComponent,
    FieldDocumentComponent,
    FieldColorComponent,
    FieldHtmlComponent,
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

    ImageGalleryModalComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    SidebarComponent,
    SplashScreenComponent,
    SearchApplicationComponent,
    DynamicFormComponent,
    DynamicInlineFormComponent,
    BreadCrumbComponent,
    NavigationTreeComponent,
    ModalConfirmComponent,
    DynamicFieldDirective,
    ClearInputDirective,
    ApplicationPathPipe
  ],
  entryComponents: [
    FieldButtonComponent,
    FieldTextComponent,
    FieldSelectComponent,
    FieldImageComponent,
    FieldDocumentComponent,
    FieldColorComponent,
    FieldPasswordComponent,
    FieldToggleButtonComponent,
    FieldHtmlComponent,
ImageGalleryModalComponent
  ]
})
export class SharedModule { }
