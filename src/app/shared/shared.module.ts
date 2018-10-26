import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SplashScreenComponent } from './components/splash-screen/splash-screen.component';
import { SearchApplicationComponent } from './components/search-application/search-application.component';
import { NgBootstrapModule } from '../ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { FormButtonComponent } from './components/dynamic-form/inputs/form-button/form-button.component';
import { FormTextComponent } from './components/dynamic-form/inputs/form-text/form-text.component';
import { FormSelectComponent } from './components/dynamic-form/inputs/form-select/form-select.component';
import { DynamicFieldDirective } from './components/dynamic-form/directives/dynamic-field.directive';
import { FormImageComponent } from './components/dynamic-form/inputs/form-image/form-image.component';
import { FormDocumentComponent } from './components/dynamic-form/inputs/form-document/form-document.component';
import { FormColorComponent } from './components/dynamic-form/inputs/form-color/form-color.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgBootstrapModule,
    RouterModule
  ],
  declarations: [
    DynamicFieldDirective,
    SidebarComponent,
    SplashScreenComponent,
    SearchApplicationComponent,
    DynamicFormComponent,
    FormButtonComponent,
    FormTextComponent,
    FormSelectComponent,
    FormImageComponent,
    FormDocumentComponent,
    FormColorComponent
  ],
  exports: [
    ReactiveFormsModule,
    SidebarComponent,
    SplashScreenComponent,
    SearchApplicationComponent,
    DynamicFormComponent
  ],
  entryComponents: [
    FormButtonComponent,
    FormTextComponent,
    FormSelectComponent,
    FormImageComponent,
    FormDocumentComponent,
    FormColorComponent
  ]
})
export class SharedModule { }

