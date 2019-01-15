import { Component, ViewChild, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';
import _find from 'lodash/find';

import { Observable, Subscription, Subject } from 'rxjs';
import { takeWhile, takeUntil } from 'rxjs/operators';

import {
  State,
  FetchContent,
  isLoadingContent,
  LinkContentAction,
  getContentActionState,
  getContent,
  FgeRouterService,
  ApplicationContent,
  Link
} from '@forge/core';
import { DynamicFormComponent, FieldConfig } from '@forge/shared';
import { dataTypes } from '../shared/content-form-modal/content-data-types.config';

@Component({
  selector: 'fge-content-html-editor',
  templateUrl: './content-html-editor.component.html'
})
export class ContentHtmlEditorComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: FieldConfig;
  loading$: Observable<boolean> | boolean;
  currentContent: ApplicationContent;

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;
  private isAliveComponent = true;
  private unsubscribeEditor = new Subject();

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute,
    private fgeRouter: FgeRouterService,
    private notifierService: NotifierService
  ) { }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params
      .subscribe(params => this.initDispatcher(params));
    this.initContent();
  }

  ngAfterViewInit() {
    this.form.changes.subscribe(() => {
      this.form.validateAllFormFields();
    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.routeParamsSubscription.unsubscribe();
    this.unsubscribeEditor.complete();
  }

  private initDispatcher({ tenantId: applicationId, groupId, contentId }: any): void {
    this.store.dispatch(new FetchContent({ applicationId, contentId }));
    this.loading$ = this.store.select(isLoadingContent);
    this.applicationId = applicationId;
    this.groupId = groupId;
  }

  private initContent(): void {
    this.store.select(getContent)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((content: ApplicationContent) => {
        if (content) {
          this.config = _assign(_clone(dataTypes['HTML']), { label: false, value: content.value, focus: true });
          this.currentContent = content;
        }
      });
  }

  private goToContentGroup(): void {
    this.fgeRouter.navigate(`content/group/${this.groupId}`);
  }

  handleCancel(): void {
    this.goToContentGroup();
  }

  handleSubmit({ value: formData, success, error}): void {
    const value = formData[this.config.name];
    const { status: status } = this.currentContent;
    const contentPayload = {
      status,
      value
    };
    const link: Link = _find(this.currentContent._links, ['rel', 'updateContentValue']);
    if (link) {
      this.store.dispatch(new LinkContentAction({
        link,
        contentPayload,
        applicationId: this.applicationId,
        groupId: this.groupId
      }));
      this.store.select(getContentActionState)
        .pipe(takeUntil(this.unsubscribeEditor))
        .subscribe((editState) => {
          const { error: errorData, loading } = editState;
          if (errorData) {
            const errors = Object.values(errorData.error.fields);
            this.unsubscribeEditor.next();
            error(errors);
          } else if (!loading) {
            this.notifierService.notify('success', 'The content has been updated successfully');
            this.unsubscribeEditor.next();
            success();
            this.goToContentGroup();
          }
        });
    }
  }

}
