import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import _find from 'lodash/find';
import _assign from 'lodash/assign';
import _clone from 'lodash/clone';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import {
  State,
  getGroup,
  FetchContent,
  getContent,
  isLoadingGroup,
  ContentGroup,
  ApplicationContent,
  Link,
  FgeRouterService,
  FgeModalService
} from '@forge/core';
import { ContentFormModalComponent } from '../shared/content-form-modal/content-form-modal.component';
import { dataTypes as availableDataTypes } from '../shared/content-form-modal/content-data-types.config';
import { FieldConfig } from '@forge/shared';

@Component({
  selector: 'fge-group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent implements OnInit, OnDestroy {

  currentGroup: ContentGroup;
  loading$: Observable<boolean> | boolean;
  editMode: boolean;
  editableContents: any[];
  listContents: any[];
  applicationId: number;
  adaContent: string;
  ready: boolean = false;

  private isAliveComponent = true;
  private modalRef: NgbModalRef;

  constructor(
    private store: Store<State>,
    private fgeModalService: FgeModalService,
    private modalService: NgbModal,
    private fgeRouter: FgeRouterService
  ) { }

  ngOnInit() {
    this.editMode = true;
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  openContentForm(): Promise<void> {
    this.modalRef = this.modalService.open(ContentFormModalComponent, { windowClass: 'modal-content-form' });
    this.modalRef.componentInstance.groupId = this.currentGroup.id;
    this.modalRef.componentInstance.group = this.currentGroup;
    this.fgeModalService.registerModal(this.modalRef);
    return this.modalRef.result.then((content: ApplicationContent) => {
        if (content) {
          if (content.displayAsList) {
            const compare = (a, b) => {
              const val = a.dataType.name.localeCompare(b.dataType.name);
              if (val === 0) {
                return a.name.localeCompare(b.name);
              }
              return val;
            };
            this.listContents.unshift(content);
            this.listContents.sort(compare);
          } else {
            const compare = (a, b) => {
              const val = a.contentData.dataType.name.localeCompare(b.contentData.dataType.name);
              if (val === 0) {
                return a.contentData.name.localeCompare(b.contentData.name);
              }
              return val;
            };
            const item = this.getFieldConfig(content);
            this.editableContents.unshift(item);
            this.editableContents.sort(compare);
          }
        }
      }).catch(() => {});
  }

  getFieldConfig(content) {
    const fieldConfig: FieldConfig = {... availableDataTypes[content.dataType.name]};
    fieldConfig.label = content.name;
    return {
      config: fieldConfig,
      contentData: content
    };
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
  }

  goToContentEdit(contentId: string): void {
    this.fgeRouter.navigate(`content/group/${this.currentGroup.id}/content/${contentId}/edit`);
  }

  initSelectors(): void {
    this.loading$ = this.store.select(isLoadingGroup);
    this.store.select(getGroup)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((group: ContentGroup) => {
        this.currentGroup = group;
        if (group) {
          this.initLists();
          this.initAdaDispatcher();
          this.ready = true;
        }
      });
  }

  private initLists(): void {
    this.editableContents = this.currentGroup.content
      .filter((content: ApplicationContent) => !content.displayAsList)
      .map((content: ApplicationContent) => {
        return this.getFieldConfig(content);
      });
    this.listContents = this.currentGroup.content.filter((content: ApplicationContent) => content.displayAsList);
  }

  private initAdaDispatcher(): void {
    const { href }: Link = _find(this.currentGroup._links, ['rel', 'supportingContent']) || {};
    if (href) {
      const splittedUrl = href.split('/');
      const contentId = + splittedUrl[splittedUrl.length - 1];
      const applicationId = + splittedUrl[splittedUrl.length - 3];
      /**
       * @TODO Refactor this implementation to perform the action from effects
       *  instead of getting the link here, should follow the current effects implementation
       *  using the fgeActionService
       */
      this.store.dispatch(new FetchContent({ applicationId, contentId }));
      this.initAdaContent();
    } else {
      this.adaContent = '';
    }
  }

  private initAdaContent(): void {
    this.store.select(getContent)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((content: ApplicationContent) => {
        if (content) {
          this.adaContent = content.value;
        }
      });
  }
}
