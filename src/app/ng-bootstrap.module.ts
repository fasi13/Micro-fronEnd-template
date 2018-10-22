import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbModalModule,
  NgbTypeaheadModule,
  NgbButtonsModule
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbDropdownModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbButtonsModule
  ],
  exports: [
    NgbPopoverModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbButtonsModule
  ]
})
export class NgBootstrapModule { }
