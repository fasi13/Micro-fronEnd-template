import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FieldConfig } from '../../dynamic-form';
import { Validators } from '@angular/forms';

@Component({
  selector: 'fge-application-form-modal',
  templateUrl: './application-form-modal.component.html',
})
export class ApplicationFormModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;
  config: FieldConfig[];

  constructor(
    private modalService: NgbModal
  ) { }

  ngOnInit() {
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
      }, {
        type: 'text',
        label: 'Value',
        name: 'value',
        placeholder: 'Enter value',
        validation: {
          required: {
            errorMsg: 'Value is required',
            validator: Validators.required
          },
          number: {
            errorMsg: 'Value should be a number',
            validator: Validators.pattern(/^-?(0|[1-9]\d*)?$/)
          }
        }
      }
    ];
  }

  open(): void {
    this.modalService.open(this.modalContent);
  }

  handleSubmit(event: Event): void {
    console.log('Form submit', event);
  }

  handleCancel(event: Event): void {
    if (event) {
      event.stopPropagation();
    }
    this.modalService.dismissAll('Cancel');
  }
}
