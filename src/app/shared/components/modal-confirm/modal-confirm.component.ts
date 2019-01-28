import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';

import { ModalConfirmConfig } from './modal-confirm.model';
import { FgeModalService } from '@forge/core';

@Component({
  selector: 'fge-modal-confirm',
  templateUrl: './modal-confirm.component.html'
})
export class ModalConfirmComponent {
  @ViewChild('modalConfirmTemplate') modalContent: ElementRef;
  @Output() readonly onsubmit: EventEmitter<any> = new EventEmitter<any>();
  @Output() readonly oncancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() config: ModalConfirmConfig;

  constructor(private modalService: FgeModalService) { }

  open(config?: ModalConfirmConfig): void {
    if (config) {
      this.config = config;
    }
    this.modalService.open(this.modalContent);
  }

  close(): void {
    this.modalService.dismissAll();
  }

  handleSubmit() {
    this.onsubmit.emit(this.config.payload);
  }

  handleCancel() {
    if (this.oncancel.observers.length > 0) {
      this.oncancel.emit();
    } else {
      this.close();
    }
  }
}
