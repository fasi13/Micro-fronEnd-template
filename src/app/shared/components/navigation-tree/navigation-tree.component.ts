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
  ObjectTransactionService,
  Application,
  ApplicationService
} from '@forge/core';
import { Store } from '@ngrx/store';

import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, debounceTime, delay } from 'rxjs/operators';

import { NavigationTreeService } from './navigation-tree.service';
import { TreeviewData } from './treeview-data.model';

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
  @ViewChild('applicationForm') applicationFormRef: ElementRef;

  treeData: TreeviewData;
  enableScrollTopBtn: boolean;
  preview: ApplicationBranding;
  previewLoading: boolean;
  previewId: string | number;

  private mouseoverSubject: BehaviorSubject<string | number> = new BehaviorSubject<string | number>(null);

  @HostListener('document:click', ['$event']) clickedOutside(event: Event) {
    this.opened = (this.elementRef.nativeElement.contains(event.target) ||
      (event.target as Node).contains(this.applicationFormRef.nativeElement)) &&
      !(event.target as Node).contains(this.overlayTemplateRef.nativeElement);
  }

  constructor(
    private navigationTreeService: NavigationTreeService,
    private store: Store<State>,
    private elementRef: ElementRef,
    private objectTransactionService: ObjectTransactionService,
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
    this.applicationService.getApplicationInfo(+this.treeData.id)
      .subscribe((application: ApiResponse<Application>) => this.treeData._links = application.data._links);
    this.navigationTreeService.getApplicationGroups(this.rootApplication.id)
    .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, this.treeData));
    this.mouseoverSubject
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
    event.stopPropagation();
    item.collapsed = !!!item.collapsed;
    if (!item.collapsed) {
      (event.currentTarget as any).parentElement.scrollIntoView();
    }
    if (!item.executedFetch) {
      this.fetchDataFor(item);
    }
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
      this.selected.emit(item.id);
    }
  }

  onScrollContent(event: Event): void {
    event.preventDefault();
    const scrollTop = this.scrollContainerRef.nativeElement.scrollTop;
    this.enableScrollTopBtn = (scrollTop > 0);
  }

  scrollToTop(event: Event): void {
    event.stopPropagation();
    this.scrollContainerRef.nativeElement.scrollTo(0, 0);
  }

  onMouseoverItem(item: TreeviewData, event: Event): void {
    event.preventDefault();
    this.previewId = item.id;
    if (item && !item.isGroup) {
      this.mouseoverSubject.next(this.previewId);
    }
  }

  hasAction(item: TreeviewData, actionName: string): boolean {
    return this.objectTransactionService.hasAction(item, actionName);
  }

  private fetchDataFor(item: TreeviewData) {
    item.executedFetch = true;
    item.loading = true;
    if (item.isGroup) {
      this.navigationTreeService.getApplications(item.parentId, item.id)
        .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, item));
    } else {
      this.navigationTreeService.getApplicationGroups(item.id)
        .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, item));
    }
  }

  private mapDataToTreeview(response: ApiResponse<DataPaginated<any>>, item: TreeviewData): void {
    item.childrenData = response.data.items.map((groupData) => new TreeviewData(
      groupData.id,
      groupData.name,
      groupData.value,
      groupData.hasOwnProperty('isEncrypted'),
      item.id,
      groupData._links
    ));
    item.loading = false;
  }
}
