import { CKEditorModule } from 'ckeditor4-angular';

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldHtmlComponent } from './field-html.component';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
} from '@angular/forms';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { FieldConfig } from '../../models';

describe('FieldHtmlComponent', () => {
  let component: FieldHtmlComponent;
  let fixture: ComponentFixture<FieldHtmlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FieldHtmlComponent],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgBootstrapModule,
        RouterModule,
        ColorPickerModule,
        CKEditorModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FieldHtmlComponent);
    component = fixture.componentInstance;
    component.config = new FieldConfig();
    component.config.label = 'htmlValue';
    component.config.name = 'htmlValue';
    component.config.validation = {};
    component.group = new FormGroup({
      [component.config.name]: new FormControl(),
    });
    spyOn(component, 'editorReady');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should configure CkEditor', () => {
    expect(component.configCkEditor).toBeTruthy();
  });
});
