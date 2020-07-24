
import {
  Component,
  OnInit,
  Input,
  HostListener,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnChanges
} from '@angular/core';
import {
  ApiResponse,
  DataPaginated,
  State,
  ApplicationBranding,
  FetchApplicationPreview,
  getApplicationPreview,
  FgeHttpActionService,
  Application,
  ApplicationService

} from '@forge/core';
import { Store } from '@ngrx/store';
import _filter from 'lodash/filter';
import _some from 'lodash/some';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime, delay } from 'rxjs/operators';

import { NavigationTreeService } from './navigation-tree.service';
import { TreeviewData } from './treeview-data.model';
import { ResetCultureAction } from './../../../core/store/culture/culture.actions';

@Component({
  selector: 'fge-navigation-tree',
  templateUrl: './navigation-tree.component.html'
})
export class NavigationTreeComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() opened: boolean;
  @Input() rootApplication: Application;
  @Input() currentApplicationId: string | number;
  @Output() readonly selected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('scrollContainer') scrollContainerRef: ElementRef;
  @ViewChild('overlayTemplate') overlayTemplateRef: ElementRef;

  treeData: TreeviewData;
  enableScrollTopBtn: boolean;
  preview: ApplicationBranding;
  previewLoading: boolean;
  previewId: string | number;
  pathData: Application[];
  pathDataOpen: Application[];
  treeDataOpen = {};

  private fetchApplicationBrandingSubject: BehaviorSubject<string | number> = new BehaviorSubject<string | number>(null);

  @HostListener('document:click', ['$event']) clickedOutside(event: Event) {
    this.opened = this.opened && (this.elementRef.nativeElement.contains(event.target) ||
      (document.getElementsByClassName('modal-dialog').length > 0 &&
       document.getElementsByClassName('modal-dialog')[0].contains(event.target as Node))) &&
      !(event.target as Node).contains(this.overlayTemplateRef.nativeElement);
  }

  constructor(
    private navigationTreeService: NavigationTreeService,
    private store: Store<State>,
    private elementRef: ElementRef,
    private httpActionService: FgeHttpActionService,
    private applicationService: ApplicationService
  ) { }

  ngOnInit() {
    this.treeData = {
      name: this.rootApplication.name,
      id: this.rootApplication.id,
      collapsed: false,
      executedFetch: true,
      isGroup: false,
      _links: this.rootApplication._links,
      childrenData: []
    };
    this.treeDataOpen[this.getPathId(this.treeData)] = this.treeData;
    this.pathDataOpen = [];
    this.generatePath(this.treeData);
    this.applicationService.getApplicationInfo(+this.treeData.id)
      .subscribe((application: ApiResponse<Application>) => this.treeData._links = application.data._links);
    this.navigationTreeService.getApplicationGroups(this.rootApplication.id)
    .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, this.treeData));
    this.fetchApplicationBrandingSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
        )
        .subscribe((applicationId: string) => {
          if (applicationId) {
            this.store.dispatch(new FetchApplicationPreview(applicationId));
          }
        });
      }

  ngOnChanges() {
    this.previewId = this.currentApplicationId;
    if (this.currentApplicationId) {
      this.store.dispatch(new FetchApplicationPreview(this.currentApplicationId));
    }
  }

  ngAfterViewInit() {
    this.store.select(getApplicationPreview)
      .pipe(delay(0))
      .subscribe((applicationPreview) => {
        if (applicationPreview) {
          const { branding, loading} = applicationPreview;
          this.preview = branding;
          this.previewLoading = loading;
        }
      });
  }

  toggleCollapse(item: TreeviewData, event: Event) {
    const elementSource = event.currentTarget;
    event.stopPropagation();
    item.collapsed = !!!item.collapsed;
    if (!item.collapsed) {
      if (!item.isGroup) {
        this.fetchApplicationBranding(item, event);
      }
    }
    if (!item.executedFetch) {
      this.fetchDataFor(item, () => {
        if (!item.collapsed) {
          this.scrollElementIntoView(this.scrollContainerRef.nativeElement, elementSource);
        }
      });
    } else {
      if (!item.collapsed) {
        this.scrollElementIntoView(this.scrollContainerRef.nativeElement, elementSource);
      }
    }
    this.generatePath(item);
  }

  clickedInside($event: Event): void {
    $event.preventDefault();
    $event.stopPropagation();
  }

  isEmptyItem(item: TreeviewData): boolean {
    return !item.loading && item.executedFetch && (!item.childrenData || item.childrenData.length === 0);
  }

  goToApplication(item: TreeviewData) {
    if (!item.isGroup) {
      /* istanbul ignore next */
      this.store.dispatch(new ResetCultureAction());
      this.selected.emit(item.id);
    }
  }

  onScrollContent(event: Event): void {
    event.preventDefault();
    const scrollTop = this.scrollContainerRef.nativeElement.scrollTop;
    this.enableScrollTopBtn = (scrollTop > 1);
  }

  scrollToTop(event: Event): void {
    event.stopPropagation();
    this.scrollContainerRef.nativeElement.children[0].scrollIntoView();
  }

  fetchApplicationBranding(item: TreeviewData, event: Event): void {
    event.preventDefault();
    this.previewId = item.id;
    if (item && !item.isGroup) {
      this.fetchApplicationBrandingSubject.next(this.previewId);
    }
  }

  hasAction(item: TreeviewData, actionName: string): boolean {
    return this.httpActionService.hasAction(item, actionName);
  }

  goToHierarchy(event: Event): void {
    let itemId = event.currentTarget['id'];
    if (itemId) {
      itemId = itemId.split('pathId')[1];
      const item: TreeviewData = this.treeDataOpen[itemId];
      if (item) {
        item.collapsed = true;
        if (item.childrenData.length > 0) {
          item.childrenData.forEach(child => {
            child.collapsed = true;
            child.executedFetch = false;
            child.childrenData = [];
          });
        }
        this.toggleCollapse(item, event);
        document.getElementById(itemId).scrollIntoView();
      }
    }
  }

  getPathId(item: TreeviewData): string {
    return item.isGroup ? `group${item.id}` : `app${item.id}`;
  }

  private scrollElementIntoView(container, element) {
    /**
     * Required timeout since we dont know how many time will take
     *  the change detector to detect the updated node and then render
     *  the UI, so that currently we are using a timeout of 100ms
     */
    setTimeout(() => {
      const cTop = container.scrollTop;
      const cBottom = cTop + container.clientHeight;
      const eTop = cTop + element.getBoundingClientRect().top;
      const eBottom = eTop + element.parentElement.clientHeight;
      if (eBottom > cBottom) {
        element.parentElement.scrollIntoView();
      }
    }, 100);
  }

  private fetchDataFor(item: TreeviewData, completed: () => void) {
    item.executedFetch = true;
    item.loading = true;
    if (item.isGroup) {
      this.navigationTreeService.getApplications(item.parentId, item.id)
        .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, item, completed));
    } else {
      this.navigationTreeService.getApplicationGroups(item.id)
        .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, item, completed));
    }
  }

  private mapDataToTreeview(response: ApiResponse<DataPaginated<any>>, item: TreeviewData, completed?: () => void): void {
    item.childrenData = response.data.items.map((groupData) => new TreeviewData(
      groupData.id,
      groupData.name,
      groupData.value,
      groupData.hasOwnProperty('isEncrypted'),
      item.id,
      groupData._links
    ));
    item.loading = false;
    if (completed) {
      completed();
    }
  }

  private generatePath(item: TreeviewData) {
    const itemId = this.getPathId(item);
    let parentId = item.parentId;
    if (parentId) {
      const parentPath = _filter(this.pathDataOpen, {'id': parentId});
      if (parentPath.length > 0) {
        parentId = parentPath[0].value !== itemId ? parentPath[0].value : parentPath[1].value;
      }
    }
    this.pathData = [];
    if (!item.collapsed) {
      this.treeDataOpen[itemId] = item;
      this.treeDataOpen[itemId].parentIdProcessed = parentId;
      const path = {
        id: item.id,
        name: item.name,
        value: itemId,
        _links: item._links
      };
      this.pathData.unshift(path);
      if (!_some(this.pathDataOpen, path)) {
        this.pathDataOpen.unshift(path);
      }
    }
    while (parentId) {
      const parent = this.treeDataOpen[parentId];
      parentId = parent.parentIdProcessed;
      this.pathData.unshift({
        id: parent.id,
        name: parent.name,
        value: this.getPathId(parent),
        _links: parent._links
      });
    }
  }
}
