import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _clone from 'lodash/clone';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeWhile, filter } from 'rxjs/operators';

import { User, NewUserAction, State, isLoadingUser, UpdateUserAction } from '@forge/core';
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
  applicationID: number;
  user: any;
  config: FieldConfig[];
  private success: any;
  private isAliveComponent = true;

  constructor(
    private modalService: NgbModal,
    private store: Store<State>,
    private route: ActivatedRoute,
      ) { }

  ngOnDestroy() {
    this.isAliveComponent = false;
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
      this.user = {};
      this.user.applicationName = '';
      configNewUserFields[3].value = true;
      this.config = _clone(configNewUserFields);
    }
    this.handleUser();
    this.modalService.open(this.modalContent);
  }

  private handleUser(): void {
    this.store.select(isLoadingUser)
    .pipe(
      takeWhile(() => this.isAliveComponent),
      filter(areUsersFetching => areUsersFetching),
    )
    .subscribe(() => {
      this.success();
      this.modalService.dismissAll();
    });
  }

  submit({ value: formData, success }): void {
    this.success = success;
    if (this.mode === 'CREATE') {
      const payload: User = {
        userName: formData.userName,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        isActive: formData.activeUser,
        applicationId: this.getCurrentApplicationId()
      };
      this.store.dispatch(new NewUserAction(payload));
    } else {
      this.store.dispatch(new UpdateUserAction({
        id: this.user.id,
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.emailAddress,
        isActive: formData.activeUser,
      }));
    }
  }

  handleCancel() {
    this.modalService.dismissAll();
  }

  private getCurrentApplicationId(): number {
    return +this.route.params['value'].tenantId;
  }
}
