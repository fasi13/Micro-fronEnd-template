import { Component, OnInit, Input, HostListener, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { TreeviewData } from './treeview-data.model';
import { NavigationTreeService } from './navigation-tree.service';
import { ApiResponse, DataPaginated } from '@forge/core';

@Component({
  selector: 'fge-navigation-tree',
  templateUrl: './navigation-tree.component.html'
})
export class NavigationTreeComponent implements OnInit {

  @Input() opened: boolean;
  @Input() rootApplicationId: string | number;
  @Input() rootApplicationName: string;
  @Input() currentApplicationId: string | number;
  @Output() readonly selected: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('scrollContainer') scrollContainerRef: ElementRef;

  treeData: TreeviewData;
  enableScrollTopBtn: boolean;

  @HostListener('document:click', ['$event']) clickedOutside() {
    this.opened = false;
  }

  constructor(
    private navigationTreeService: NavigationTreeService,
  ) { }

  ngOnInit() {
    this.treeData = {
      name: this.rootApplicationName,
      id: this.rootApplicationId,
      collapsed: false,
      executedFetch: true,
      isGroup: false,
      childrenData: []
    };
    this.navigationTreeService.getApplicationGroups(this.rootApplicationId)
      .subscribe((response: ApiResponse<DataPaginated<any>>) => this.mapDataToTreeview(response, this.treeData));
  }

  toggleCollapse(item: TreeviewData, event: Event) {
    event.stopPropagation();
    item.collapsed = !!!item.collapsed;
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
      item.id
    ));
    item.loading = false;
  }
}
