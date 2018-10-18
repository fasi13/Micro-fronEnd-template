import { Component, OnInit, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { State, getApplicationInfo, Application, ContentService, FetchContentGroups, ContentGroup } from '@forge/core';
import { Subscription } from 'rxjs';
import { NotifierService } from 'angular-notifier';

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
  mode: 'CREATE' | 'EDIT';
  
  get formControls() { return this.groupForm.controls; }
  
  private applicationId: string | number;
  private appInfoSubscription: Subscription;
  private contentGroup: ContentGroup;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private store$: Store<State>,
    private contentService: ContentService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.initSelectors();
  }

  ngOnDestroy() {
    this.appInfoSubscription.unsubscribe();
  }

  open(contentGroup: ContentGroup): void {
    this.contentGroup = contentGroup;
    this.mode = contentGroup ? 'EDIT' : 'CREATE';
    const name = this.mode === 'EDIT' ? contentGroup.name : '';
    this.groupForm = this.formBuilder.group({
      name: [name, Validators.compose([Validators.required, Validators.minLength(3)])]
    });
    this.modalService.open(this.modalContent);
  }

  onSubmit(closeModal: Function): void {
    this.submitted = true;
    if (!this.formControls.name.errors) {
      this.loading = true;
      if (this.mode === 'EDIT') {
        this.updateContentGroup(closeModal);
      } else {
        this.addContentGroup(closeModal);
      }
    }
  }

  private addContentGroup(closeModal: Function): void {
    this.contentService.addContentGroup(this.applicationId, this.formControls.name.value)
        .subscribe(...(this.subscriptionHandlers(closeModal)))
  }

  private updateContentGroup(closeModal: Function): void {
    const { id } = this.contentGroup;
    this.contentService.updateContentGroup(this.applicationId, id, this.formControls.name.value)
        .subscribe(...(this.subscriptionHandlers(closeModal)))
  }

  private subscriptionHandlers(closeModal: Function): any[] {
    return [
      () => {
        if (closeModal) {
          closeModal();
        }
        this.loading = false;
        this.store$.dispatch(new FetchContentGroups({ applicationId: this.applicationId }));
        this.notifierService.notify('success', this.getNotificationMsg());
      },
      (error) => {
        this.loading = false;
        if (error.status === 400) {
          this.formControls.name.setErrors({ duplicated: true });
        } else {
          this.notifierService.notify('error', 'Whoops, something went wrong!. Please try again later.')
        }
      }
    ];
  }

  private initSelectors(): void {
    this.appInfoSubscription = this.store$.select(getApplicationInfo)
      .subscribe((applicationInfo: Application) => this.applicationId = applicationInfo.id);
  }

  private getNotificationMsg(): string {
    return this.mode === 'EDIT' ?
      'The content group has been updated successfully' :
      'The content group has been created successfully';
  }
}
