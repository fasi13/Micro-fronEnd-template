import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ModalConfirmConfig } from './modal-confirm.model';

@Component({
    selector: 'fge-modal-confirm',
    templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent {
    @ViewChild('modalConfirmTemplate') modalContent: ElementRef;
    @Output() readonly onsubmit: EventEmitter<any> = new EventEmitter<any>();
    @Output() readonly oncancel: EventEmitter<any> = new EventEmitter<any>();
    @Input() config: ModalConfirmConfig;

    constructor(private modalService: NgbModal) { }

    open(): void {
      this.modalService.open(this.modalContent);
    }

    close(): void {
        this.modalService.dismissAll();
    }

    handleSubmit() {
      this.onsubmit.emit();
    }

    handleCancel() {
      if (this.oncancel.observers.length > 0) {
        this.oncancel.emit();
      } else {
        this.close();
      }
    }
}
