import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import _clone from 'lodash/clone';
import _find from 'lodash/find';

import { Observable, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

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
import { config as fieldConfiguration } from './content-editor.config';

@Component({
  selector: 'fge-content-editor',
  templateUrl: './content-editor.component.html'
})
export class ContentEditorComponent implements OnInit, OnDestroy {

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  config: FieldConfig[];
  loading$: Observable<boolean> | boolean;
  currentContent: ApplicationContent;

  private routeParamsSubscription: Subscription;
  private applicationId: string;
  private groupId: string;
  private isAliveComponent = true;

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

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.routeParamsSubscription.unsubscribe();
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
          fieldConfiguration[0].value = content.value;
          this.config = _clone(fieldConfiguration);
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
    const { value } = formData;
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
        .subscribe((editState) => {
          const { error: errorData, loading } = editState;
          if (errorData) {
            const errors = Object.values(errorData.error.fields);
            error(errors);
          } else if (!loading) {
            success();
            this.goToContentGroup();
            this.notifierService.notify('success', 'The content has been updated successfully');
          }
        });
    }
  }

}
