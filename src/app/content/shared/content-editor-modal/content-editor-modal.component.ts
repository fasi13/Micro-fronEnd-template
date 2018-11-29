import { Component, ViewChild, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';

import { Observable, Subject } from 'rxjs';
import { takeUntil, takeWhile } from 'rxjs/operators';

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
export class ContentEditorModalComponent implements OnInit, OnDestroy {

  @ViewChild('modalTemplate') modalContent: ElementRef;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  @Input() content: ApplicationContent;
  @Input() config: FieldConfig;
  @Input() link: Link;
  @Input() groupId: string;

  private applicationInfo: Application;
  private fieldToEdit: string;
  private unsubscribeEditor = new Subject();
  private isAliveComponent = true;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<State>,
    private notifierService: NotifierService,
  ) { }

  ngOnInit() {
    this.fieldToEdit = this.config.label;
    this.config.focus = true;
    this.config.value = this.content[this.fieldToEdit];
    this.handleApplicationInfo(this.store.select(getApplicationInfo));
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.unsubscribeEditor.complete();
  }

  private handleApplicationInfo(appInfo$: Observable<Application>): void {
    appInfo$.pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((applicationInfo: Application) => this.applicationInfo = applicationInfo);
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
      .pipe(takeUntil(this.unsubscribeEditor))
      .subscribe((recordState) => {
        const { error: errorData, loading } = recordState;
        if (errorData) {
          const errors = Object.values(errorData.error.fields);
          this.unsubscribeEditor.next();
          error(errors);
        } else if (!loading) {
          this.notifierService.notify('success', `The content "${this.config.label}" has been updated successfully`);
          this.unsubscribeEditor.next();
          success();
          this.activeModal.close();
        }
      });
  }

  handleCancel(): void {
    this.activeModal.close();
  }

}
