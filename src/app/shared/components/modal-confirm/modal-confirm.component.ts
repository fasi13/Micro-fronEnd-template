import { Component, ViewChild, ElementRef, EventEmitter, Output, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'fge-modal-confirm',
    templateUrl: './modal-confirm.component.html'
})

export class ModalConfirmComponent {
    @ViewChild('modalConfirmTemplate') modalContent: ElementRef;
    @Output() readonly onsubmit: EventEmitter<any> = new EventEmitter<any>();
    @Input() title: string;
    @Input() message: string;

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
}
