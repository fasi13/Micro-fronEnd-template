import { Component, ViewChild, ElementRef, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';

import { Observable } from 'rxjs';

import {
  Application,
  State,
  LinkContentAction,
  getContentActionState,
  getApplicationInfo,
  ApplicationContent,
  Link
} from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';

@Component({
  selector: 'fge-content-editor-modal',
  templateUrl: './content-editor-modal.component.html'
})
export class ContentEditorModalComponent implements OnInit {

  @ViewChild('modalTemplate') modalContent: ElementRef;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() content: ApplicationContent;
  @Input() config: FieldConfig;
  @Input() link: Link;
  @Input() groupId: string;

  private applicationInfo: Application;
  private fieldToEdit: string;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<State>,
    private notifierService: NotifierService,
  ) { }

  ngOnInit() {
    this.fieldToEdit = this.config.label;
    this.config.value = this.content[this.fieldToEdit];
    this.handleApplicationInfo(this.store.select(getApplicationInfo));
  }

  private handleApplicationInfo(appInfo$: Observable<Application>): void {
    appInfo$.subscribe((applicationInfo: Application) => this.applicationInfo = applicationInfo);
  }

  handleSubmit({ value: formData, success, error}): void {
    const { status: status } = this.content;
    const { id: applicationId } = this.applicationInfo;
    const value = formData[this.config.name];
    const contentPayload = {
      status
    };
    contentPayload[this.fieldToEdit] = value;
    this.store.dispatch(new LinkContentAction({
      link: this.link,
      contentPayload,
      applicationId,
      groupId: this.groupId
    }));
    this.store.select(getContentActionState)
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          error(errors);
        } else if (!loading) {
          this.notifierService.notify('success', `The content "${this.config.label}" has been updated successfully`);
          success();
          this.activeModal.close();
        }
      });
  }

  handleCancel(): void {
    this.activeModal.close();
  }

}
