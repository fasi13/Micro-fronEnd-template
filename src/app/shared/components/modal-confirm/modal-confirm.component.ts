import { Component, ViewChild, ElementRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'fge-modal-confirm',
    templateUrl: './modal-confirm.component.html'
})

export class ModalConfirmComponent {
    @ViewChild('modalConfirmTemplate') modalContent: ElementRef;

    constructor(private modalService: NgbModal) { }

    open(): void {
        this.modalService.open(this.modalContent);
    }
}
