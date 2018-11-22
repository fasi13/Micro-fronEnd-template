import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbModalModule,
  NgbTypeaheadModule,
  NgbButtonsModule,
  NgbPaginationModule
} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    NgbDropdownModule,
    NgbTooltipModule,
    NgbPopoverModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbButtonsModule,
    NgbTooltipModule,
    NgbPaginationModule
  ],
  exports: [
    NgbPopoverModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbButtonsModule,
    NgbTooltipModule,
    NgbPaginationModule
  ]
})
export class NgBootstrapModule { }
