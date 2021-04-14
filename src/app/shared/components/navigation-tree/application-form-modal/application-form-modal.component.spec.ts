
import { RouterModule } from '@angular/router';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { TestBed, ComponentFixture, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { NgBootstrapModule } from 'src/app/ng-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NotifierModule } from 'angular-notifier';
import { State, TestInitialState } from 'src/app/core/store/store.reducers';
import { CoreModule } from 'src/app/core/core.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApplicationFormModalComponent } from './application-form-modal.component';
import { FgeHttpActionService } from '@forge/core';
import { throwError } from 'rxjs';



describe('ApplicationFormModalComponent', () => {
  let fixture: ComponentFixture<ApplicationFormModalComponent>;
  let component: ApplicationFormModalComponent;
  let store: MockStore<State>;
  let httpActionService: FgeHttpActionService;
  const  initialState: State = TestInitialState;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ NgbActiveModal, provideMockStore({ initialState })],
      declarations: [],
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
    fixture = TestBed.createComponent(ApplicationFormModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    httpActionService = TestBed.get(FgeHttpActionService);
  });


  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('handleSubmit: on error, should call error', fakeAsync(() => {
    let observer = {value: '', success: () => {}, error: () => {}};
    spyOn(observer, 'error').and.callThrough();
    spyOn(httpActionService, 'performAction').and.returnValue(throwError({error: {fields: { value: ''}}}));
    component.handleSubmit(observer);
    flushMicrotasks();
    expect(observer.error).toHaveBeenCalledTimes(1);
  }));

  it('handleSubmit: on error, no fields, should call error', fakeAsync(() => {
    let observer = {value: '', success: () => {}, error: () => {}};
    spyOn(observer, 'error').and.callThrough();
    spyOn(httpActionService, 'performAction').and.returnValue(throwError({error: {errors: ''}}));
    component.handleSubmit(observer);
    flushMicrotasks();
    expect(observer.error).toHaveBeenCalledTimes(1);
  }));

  afterEach(() => {
    fixture.destroy();
  });

});


