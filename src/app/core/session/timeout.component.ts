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
  timeoutHandle: any;
  dialogReference: NgbModalRef;
  secondsToLogout: number;

  constructor(
    private modalService: FgeModalService,
    private timeoutService: TimeoutService
  ) {
    this.timeoutService.timeoutComponent = this;
  }

  initTimeoutDialog(timeoutAlertDelay: number) {
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
    const timeoutAlertDelaySeconds = 30;
    clearTimeout(this.timeoutHandle);
    this.timeoutHandle = setTimeout(() => {
      thisComponent.initTimeoutDialog(timeoutAlertDelaySeconds);
    }, (timeoutMinutes * 60 - timeoutAlertDelaySeconds) * 1000);
  }

  close() {
    clearInterval(this.countDownIntervalHandle);
    clearTimeout(this.timeoutHandle);
    this.dialogReference.close();
  }

  stay() {
    this.close();
    this.timeoutService.extendSession();
  }

  logout() {
    this.close();
    this.timeoutService.logout();
    this.modalService.dismissAll();
  }
  ngOnDestroy() {
    this.initTimeoutDialog = () => {};
  }
}
