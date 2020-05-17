import { NgModule } from '@angular/core';
import {
  NgbDropdownModule,
  NgbTooltipModule,
  NgbPopoverModule,
  NgbModalModule,
  NgbTypeaheadModule,
  NgbButtonsModule,
  NgbPaginationModule,
  NgbDatepickerModule,
  NgbAccordionModule
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
    NgbDatepickerModule,
    NgbAccordionModule
  ],
  exports: [
    NgbPopoverModule,
    NgbModalModule,
    NgbTypeaheadModule,
    NgbButtonsModule,
    NgbTooltipModule,
    NgbPaginationModule,
    NgbDatepickerModule,
    NgbAccordionModule
  ]
})
export class NgBootstrapModule { }
