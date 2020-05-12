import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbModalModule,
  NgbTypeaheadModule,
  NgbButtonsModule,
  NgbPaginationModule,
  NgbDatepickerModule
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
    NgbPaginationModule,
    NgbDatepickerModule

  ],
  exports: [
    NgbPopoverModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbButtonsModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbDatepickerModule
  ]
})
export class NgBootstrapModule { }
