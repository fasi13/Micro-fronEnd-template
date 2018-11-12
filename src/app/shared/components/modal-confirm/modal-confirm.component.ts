import { Component, Input } from '@angular/core';

@Component({
    selector: 'fge-modal-confirm',
    templateUrl: './modal-confirm.component.html'
})

export class ModalConfirmComponent {
    @Input() title;
    @Input() message;
}
