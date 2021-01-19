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
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export class  MockNgbModalRef {
  result: Promise<any> = new Promise((resolve, reject) => resolve('x'));
}

describe('FieldHtmlComponent', () => {
  let component: FieldHtmlComponent;
  let fixture: ComponentFixture<FieldHtmlComponent>;
  let modalService: NgbModal;
  let mockModalRef: MockNgbModalRef = new MockNgbModalRef();
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
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [provideMockStore({})],
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
    fixture.detectChanges();
    modalService = TestBed.get(NgbModal);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should configure CkEditor', () => {
    expect(component.configCkEditor).toBeTruthy();
  });

  it('should update formValue when keyUp in source mode', () => {
    const compiled = fixture.debugElement.nativeElement;
    const html1 = '<h1>Test</h1>';
    setTimeout(function() {
      component.editor.editor.mode = 'source';
      component.editor.editor.setData(html1);
      compiled.dispatchEvent(new KeyboardEvent('keyup'), {
        'key': 'Enter'
    });
      expect(component.group.value[component.config.name]).toBe(html1);
    }, 3000);
    expect(1).toBeTruthy();
  });

  it('should call on editorReady', () => {
      component._editor = {editor:{on: function(){}}};
      expect(component.editorReady(component.editor));
  });


 it('should call on imageaction', () => {
    const html2 = '<h1>Test</h1>';
    component._editor = {editor : {mode : 'source', setData : function(html){}, getData: function(){
      return html2;
    }, on :  function(){}} , insertHtml: function(){}};
    const xy = [{ id: 1, name: 'Website branding', value: [{ id: 2, name: 'image2' }] }];
    expect(component.imageaction(component._editor, xy));
  });

  it('should open modal', () => {
    component._editor = {editor : {mode : 'source', on :  function(){}} , insertHtml: function(){}};
    spyOn(modalService, 'open').and.returnValue(mockModalRef);
    component.imageevent(component._editor);
    expect(modalService.open);
  });

  it('should call on keyup', () => {
    const html3 = '<h1>Test</h1>';
      component._editor = {editor : {mode : 'source', setData : function(html){}, getData: function(){
      return html3;
    }, on :  function(){}} , insertHtml: function(){}};
    component.config.name = 'htmlValue';
    expect(component.onkeyup());
  });

  afterEach(() => {
    fixture.destroy();
  });
});