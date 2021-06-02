import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FgeModalService } from '../services';
import { TimeoutService } from '../services/timeout.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'fge-session-timeout-modal',
  templateUrl: './timeout.component.html',
})

export class TimeoutComponent implements OnDestroy {
  @ViewChild('timeoutModalTemplate') modalContent: ElementRef;
  countDownIntervalHandle: any;
  timeoutAlertDelaySeconds = 30;
  timeoutHandle: any;
  dialogReference: NgbModalRef;
  secondsToLogout: number;

  constructor(
    private modalService: FgeModalService,
    private timeoutService: TimeoutService
  ) {
    this.timeoutService.timeoutComponent = this;
  }

  private initTimeoutDialog(timeoutAlertDelay: number) {
    if (!this.timeoutService.user) {
      return;
    }

    clearInterval(this.countDownIntervalHandle);
    this.dialogReference = this.modalService.open(this.modalContent, { backdrop: 'static', keyboard: false });

    this.secondsToLogout = timeoutAlertDelay;
    this.countDownIntervalHandle = setInterval(() => {
      this.secondsToLogout--;
      if (this.secondsToLogout < 0) {
        this.logout();
      }
    }, 1000);
  }

  resetSessionTimeout(timeoutMinutes: number, thisComponent: TimeoutComponent) {
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      thisComponent.initTimeoutDialog(this.timeoutAlertDelaySeconds);
    }, (timeoutMinutes * 60 - this.timeoutAlertDelaySeconds) * 1000);
  }

  private _close() {
    clearInterval(this.countDownIntervalHandle);
    clearTimeout(this.timeoutHandle);
    this.dialogReference.close();
  }

  stay() {
    this._close();
    this.timeoutService.extendSession();
  }

  logout() {
    this._close();
    this.timeoutService.logout();
    this.modalService.dismissAll();
  }
  ngOnDestroy() {
    this.initTimeoutDialog = () => {
      //keep this empty
    };
  }
}
