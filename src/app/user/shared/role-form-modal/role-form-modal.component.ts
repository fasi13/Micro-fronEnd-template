import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { FieldConfig } from '@forge/shared';
import { FgeModalService, State, ExecuteRoleAction, UserRoleLink, getRoleActionState } from '@forge/core';
import { Validators } from '@angular/forms';
import { UserRole } from 'src/app/core/models/user/user-role.model';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'fge-role-form-modal',
  templateUrl: './role-form-modal.component.html',
})
export class RoleFormModalComponent implements OnInit, OnDestroy {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  mode: 'CREATE' | 'EDIT';
  config: FieldConfig[];

  private unsubscribeEditor = new Subject();

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

  ngOnDestroy() {
    this.unsubscribeEditor.complete();
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

  handleSubmit({ value: formData, success, error}): void {
    this.store.dispatch(new ExecuteRoleAction({
      action: UserRoleLink.CREATE_ROLE,
      actionPayload: {
        ...formData
      }
    }));
    this.store.select(getRoleActionState)
      .pipe(takeUntil(this.unsubscribeEditor))
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          this.unsubscribeEditor.next();
          error(errors);
        } else if (!loading) {
          this.unsubscribeEditor.next();
          success();
          this.modalService.dismissAll();
        }
      });
  }

  handleCancel() {
    this.modalService.dismissAll();
  }
}
