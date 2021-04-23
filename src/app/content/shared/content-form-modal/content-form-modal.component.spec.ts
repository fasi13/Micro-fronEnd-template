
import { RouterModule } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { ContentFormModalComponent } from './content-form-modal.component';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ContentService } from '@forge/core';
import { of, throwError } from 'rxjs';



describe('ContentFormModalComponent', () => {
  let fixture: ComponentFixture<ContentFormModalComponent>;
  let component: ContentFormModalComponent;
  let store: MockStore<State>;
  const  initialState: State = TestInitialState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ NgbActiveModal, provideMockStore({ initialState })],
      declarations: [ContentFormModalComponent],
      imports: [
        NotifierModule,
        HttpClientModule,
        CoreModule,
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
    fixture = TestBed.createComponent(ContentFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('switchDataType: when type empty, do nothing', () => {
    let currentType = component.currentType
    component.switchDataType('');
    expect(component.currentType).toBe(currentType);
  });

  it('switchDataType: when html, should set text type', () => {
    component.applicationInfo = {id:1, name:'1', value:'', _links:null};
    component.switchDataType('HTML');
    let config = component.config[component.config.length - 1];
    expect(component.currentType).toBe('HTML');
    expect(config.type).toBe('contentEditor');
    expect((config as any).original.type).toBe('text');
    expect((config as any).applicationId).toBe(1);
  });

  it('switchDataType: when color, should set color type', () => {
    component.applicationInfo = {id:1, name:'1', value:'', _links:null};
    component.switchDataType('Color Picker');
    let config = component.config[component.config.length - 1];
    expect(component.currentType).toBe('Color Picker');
    expect(config.type).toBe('contentEditor');
    expect((config as any).original.type).toBe('color');
    expect((config as any).applicationId).toBe(1);
  });

  it('switchDataType: when called twice, should work', () => {
    component.applicationInfo = {id:1, name:'1', value:'', _links:null};
    component.switchDataType('HTML');
    component.switchDataType('Color Picker');
    let config = component.config[component.config.length - 1];
    expect(component.currentType).toBe('Color Picker');
    expect(config.type).toBe('contentEditor');
    expect((config as any).original.type).toBe('color');
    expect((config as any).applicationId).toBe(1);
  });

  it('handleSubmit: success', (done) => {
    component.applicationInfo = {id:1, name:'1', value:'', _links: null};
    component.applicationDataTypes = [];
    component.activeModal = { close: () => {} } as any;
    let contentService = TestBed.get(ContentService);
    spyOn(contentService, 'addContentToGroup').and.returnValue(of({}));
    let handler = {
      value: {},
      success: () => {},
      error: () => {}
    }
    spyOn(handler, 'success');
    component.handleSubmit(handler as any).then(() => {
      expect(handler.success).toHaveBeenCalledTimes(1);
      done();
    });
  });

  it('handleSubmit: error', (done) => {
    component.applicationInfo = {id:1, name:'1', value:'', _links: null};
    component.applicationDataTypes = [];
    component.activeModal = { close: () => {} } as any;
    let contentService = TestBed.get(ContentService);
    spyOn(contentService, 'addContentToGroup').and.returnValue(throwError({error: {fields: {}}}));
    let handler = {
      value: {},
      success: () => {},
      error: () => {}
    }
    spyOn(handler, 'error');
    component.handleSubmit(handler as any).then(() => {
      expect(handler.error).toHaveBeenCalledTimes(1);
      done();
    });
  });

  afterEach(() => {
    fixture.destroy();
  });

});


