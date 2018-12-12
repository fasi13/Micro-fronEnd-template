import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FieldConfig } from '../../dynamic-form';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Validators } from '@angular/forms';

@Component({
  selector: 'fge-application-group-form-modal',
  templateUrl: './application-group-form-modal.component.html',
})
export class ApplicationGroupFormModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;

  config: FieldConfig[];

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.initFormConfig();
  }

  open(): void {
    this.modalService.open(this.modalContent);
  }

  handleSubmit(event: Event): void {
    console.log(event);
  }

  handleCancel(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.modalService.dismissAll('cancel');
  }

  private initFormConfig() {
    this.config = [
      {
        type: 'text',
        label: 'Name',
        name: 'name',
        placeholder: 'Enter name',
        validation: {
          required: {
            errorMsg: 'Name is required',
            validator: Validators.required
          }
        }
      }
    ];
  }
}
