import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FieldConfig } from '@forge/shared';
import { FgeModalService } from '@forge/core';
import { Validators } from '@angular/forms';

@Component({
  selector: 'fge-role-form-modal',
  templateUrl: './role-form-modal.component.html',
})
export class RoleFormModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  mode: 'CREATE' | 'EDIT';
  config: FieldConfig[];

  constructor(
    private modalService: FgeModalService
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
            errorMsg: 'Role Name should have at least 2 characters',
            validator: Validators.minLength(2)
          },
          maxlength: {
            errorMsg: 'Role Name should not have more than 200 characters.',
            validator: Validators.maxLength(200)
          }
        }
      }
    ];
  }

  /** @TODO Add a proper type for Role */
  open(role: any): void {
    this.mode = role ? 'EDIT' : 'CREATE';
    if (this.mode === 'CREATE') {
      delete this.config[0].value;
    } else {
      this.config[0].value = role.name;
    }
    this.modalService.open(this.modalContent, { windowClass: 'modal-content-form' });
  }

  handleSubmit({ value: formData, success}): void {
    console.log(formData);
    success();
  }

  handleCancel() {
    this.modalService.dismissAll();
  }

}
