import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class FgeModalService {

  private _registeredModals: NgbModalRef[] = [];

  constructor(
    private modalService: NgbModal
  ) { }

  open(content: any, options?: NgbModalOptions): NgbModalRef {
    const currentRef: NgbModalRef = this.modalService.open(content, options);
    this._registeredModals.push(currentRef);
    return currentRef;
  }

  dismissAll(reason?: any): void {
    while (this._registeredModals.length > 0) {
      const currentRef: NgbModalRef = this._registeredModals.pop();
      currentRef.dismiss(reason);
    }
  }

  registerModal(modalRef: NgbModalRef): void {
    this._registeredModals.push(modalRef);
  }

}
