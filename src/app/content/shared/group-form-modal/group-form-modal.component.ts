import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State, getApplicationInfo, Application, ContentService, FetchContentGroups } from '@forge/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'fge-group-form-modal',
  templateUrl: './group-form-modal.component.html',
})
export class GroupFormModalComponent implements OnInit, OnDestroy {

  @ViewChild('modalTemplate')
  modalContent: ElementRef;
  groupForm: FormGroup;
  submitted = false;
  loading = false;

  get formControls() { return this.groupForm.controls; }

  private applicationId: string | number;
  private appInfoSubscription: Subscription;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store$: Store<State>,
    private contentService: ContentService
  ) { }

  ngOnInit() {
    this.groupForm = this.formBuilder.group({
      name: ['', Validators.compose([Validators.required, Validators.minLength(3)])]
    });
    this.initSelectors();
  }

  ngOnDestroy() {
    this.appInfoSubscription.unsubscribe();
  }

  open(): void {
    this.modalService.open(this.modalContent);
  }

  onSubmit(closeModal: Function): void {
    this.submitted = true;
    if (!this.formControls.name.errors) {
      this.loading = true;
      this.contentService.addContentGroup(this.applicationId, this.formControls.name.value)
        .subscribe(
          () => {
            if (closeModal) {
              closeModal();
            }
            this.loading = false;
            this.store$.dispatch(new FetchContentGroups({ applicationId: this.applicationId }));
          },
          (error) => {
            this.loading = false;
            if (error.status === 400) {
              this.formControls.name.setErrors({ duplicated: true });
            }
          }
        )
    }
  }

  private initSelectors(): void {
    this.appInfoSubscription = this.store$.select(getApplicationInfo)
      .subscribe((applicationInfo: Application) => this.applicationId = applicationInfo.id);
  }
}
