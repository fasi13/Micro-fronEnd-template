import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
import { Store } from '@ngrx/store';

import { Subject } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';

import { User, State, UserTransaction, getUserRecordState, getApplicationPath } from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { configNewUserFields, configUpdateUserFields } from './user-form-modal.config';

@Component({
  selector: 'fge-user-form-modal',
  templateUrl: './user-form-modal.component.html'
})
export class UserFormModalComponent implements OnDestroy {
  @ViewChild('modalTemplate') modalContent: ElementRef;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  mode: 'CREATE' | 'EDIT';
  applicationId: number;
  user: any;
  config: FieldConfig[];

  private isAliveComponent = true;
  private unsubscribeModal = new Subject();

  constructor(
    private modalService: NgbModal,
    private store: Store<State>
      ) { }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.unsubscribeModal.complete();
  }

  open(user: any): void {
    this.mode = user ? 'EDIT' : 'CREATE';
    if (user) {
      this.user = user;
      configUpdateUserFields[0].value = user.firstName;
      configUpdateUserFields[1].value = user.lastName;
      configUpdateUserFields[2].value = user.email;
      configUpdateUserFields[3].value = user.isActive;
      this.config = _clone(configUpdateUserFields);
    } else {
      this.store.select(getApplicationPath)
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((applicationResponse) => {
        const application = applicationResponse.data[applicationResponse.data.length - 1];
        configNewUserFields[3].value = true;
        configNewUserFields[7].value = application['name'];
        this.applicationId = application['id'];
        this.user = {};
        this.config = _clone(configNewUserFields);
      });
    }
    this.modalService.open(this.modalContent, { windowClass: 'modal-content-form' });
  }

  submit({ value: formData, success, error}): void {
    if (this.mode === 'CREATE') {
      const payload: User = {
        userName: formData.userName,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        isActive: formData.activeUser,
        applicationId: this.applicationId
      };
      this.store.dispatch(new UserTransaction(payload, 'POST' ));
    } else {
      this.store.dispatch(new UserTransaction({
        id: this.user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        isActive: formData.activeUser,
      }, 'PUT'));
    }

    this.store.select(getUserRecordState)
      .pipe(takeUntil(this.unsubscribeModal))
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          this.unsubscribeModal.next();
          error(errors);
        } else if (!loading) {
          this.unsubscribeModal.next();
          success();
          this.modalService.dismissAll();
        }
      });
  }

  handleCancel() {
    this.modalService.dismissAll();
  }
}
