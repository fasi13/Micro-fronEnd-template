import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbModalModule
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbDropdownModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbModalModule
  ],
  exports: [
    NgbPopoverModule,
    NgbModalModule
  ]
})
export class NgBootstrapModule { }
