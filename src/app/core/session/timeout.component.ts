import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FgeModalService } from '../services';
import { TimeoutService } from '../services/timeout.service';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export const timeoutGlobals: any = {};

@Component({
  selector: 'fge-session-timeout-modal',
  templateUrl: './timeout.component.html',
})

export class TimeoutComponent implements AfterViewInit {
  @ViewChild('timeoutModalTemplate') modalContent: ElementRef;
  countDownIntervalHandle: any;
  timeoutHandle: any;
  dialogReference: NgbModalRef;
  secondsToLogout: number;

  constructor(
    private modalService: FgeModalService,
    private timeoutService: TimeoutService
  ) {
    this.timeoutService.onRequestReceived = this.resetSessionTimeout;
    timeoutGlobals.this = this;
  }

  initTimeoutDialog(timeoutAlertDelay: number) {
    if (!this.timeoutService.user) {
      return;
    }

    clearInterval(this.countDownIntervalHandle);
    this.dialogReference = this.modalService.open(timeoutGlobals.modalContent, { backdrop: 'static', keyboard: false });
    this.secondsToLogout = timeoutAlertDelay;
    this.countDownIntervalHandle = setInterval(() => {
      this.secondsToLogout--;
      if (this.secondsToLogout < 0) {
        this.logout();
      }
    }, 1000);
  }

  resetSessionTimeout(timeoutMinutes: number) {
    const timeoutAlertDelaySeconds = 50;
    clearTimeout(this.timeoutHandle);

    this.timeoutHandle = setTimeout(() => {
      timeoutGlobals.this.initTimeoutDialog(timeoutAlertDelaySeconds);
    }, (timeoutMinutes * 60 - timeoutAlertDelaySeconds) * 1000);
  }

  ngAfterViewInit() {
    timeoutGlobals.modalContent = this.modalContent;
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
  }
}
