import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'fge-change-password',
    templateUrl: './changePassword.component.html'
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
    newPassword = new FormControl('');
    ngOnInit() {

    }

    ngOnDestroy() {

    }
}