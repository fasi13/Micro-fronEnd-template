import { ContentActionTypes, FetchContent } from './../../core/store/content/content.actions';
import { CoreModule } from './../../core/core.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from './../../shared/shared.module';
import { ContentHtmlEditorComponent } from './content-html-editor.component';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Store, Action } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';



describe('ContentHtmlEditorComponent', () => {
  let fixture: ComponentFixture<ContentHtmlEditorComponent>;
  let component: ContentHtmlEditorComponent;
  let store: MockStore<State>;
  const  initialState: State = TestInitialState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ provideMockStore({ initialState })],
      declarations: [ContentHtmlEditorComponent],
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
    fixture = TestBed.createComponent(ContentHtmlEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });


  it('should dispatch an action to load data when created', () => {

    expect(store.dispatch).toHaveBeenCalledWith(new FetchContent({ applicationId: undefined, contentId: undefined }));


    store.scannedActions$.subscribe((a: Action) => expect(
      [
        '@ngrx/store/init',
        ContentActionTypes.FETCH_CONTENT,
        ContentActionTypes.FETCH_CONTENT_COMPLETED,
      ].includes(a.type)).toBeTruthy());
  });

  it('setupContentConfig: should set config with original data', () => {
    component.applicationId = '2';
    component.setupContentConfig({value:'test1', name:'test1', version: 1, })
    expect((component.config as any).applicationId).toBe(component.applicationId);
    expect((component.config as any).original.value).toBe('test1');
    expect((component.config as any).original.type).toBe('html');
    expect(component.config.type).toBe('contentEditor');
  });

  afterEach(() => {
    fixture.destroy();
  });

});


