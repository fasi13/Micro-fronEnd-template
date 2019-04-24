import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FieldConfig } from '@forge/shared';
import { FgeModalService, State, ExecuteRoleAction, UserRoleLink } from '@forge/core';
import { Validators } from '@angular/forms';
import { UserRole } from 'src/app/core/models/user/user-role.model';
import { Store } from '@ngrx/store';

@Component({
  selector: 'fge-role-form-modal',
  templateUrl: './role-form-modal.component.html',
})
export class RoleFormModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  mode: 'CREATE' | 'EDIT';
  config: FieldConfig[];

  constructor(
    private modalService: FgeModalService,
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.config = [
      {
        type: 'text',
        label: 'Role Name',
        name: 'name',
        placeholder: 'Role Name',
        validation: {
          required: {
            errorMsg: 'Role Name is required.',
            validator: Validators.required
          },
          minlength: {
            errorMsg: 'Role Name should have at least 3 characters',
            validator: Validators.minLength(3)
          },
          maxlength: {
            errorMsg: 'Role Name should not have more than 100 characters.',
            validator: Validators.maxLength(100)
          }
        }
      }
    ];
  }

  open(role: UserRole): void {
    this.mode = role ? 'EDIT' : 'CREATE';
    if (this.mode === 'CREATE') {
      delete this.config[0].value;
    } else {
      this.config[0].value = role.name;
    }
    this.modalService.open(this.modalContent, { windowClass: 'modal-content-form' });
  }

  handleSubmit({ value: formData, success}): void {
    this.store.dispatch(new ExecuteRoleAction({
      action: UserRoleLink.CREATE_ROLE,
      actionPayload: {
        ...formData,
        isInherited: false
      }
    }));
    success();
  }

  handleCancel() {
    this.modalService.dismissAll();
  }

}
