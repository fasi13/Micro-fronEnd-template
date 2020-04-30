
import {
  Component,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,

} from '@angular/core';
import { NgbActiveModal, NgbAccordion, NgbPanelChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import _clone from 'lodash/clone';
import _assign from 'lodash/assign';

import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import {
  State,
  getApplicationInfo,
  Application,
  ApplicationContent,
  ContentService,
  ApiResponse,
  DataPaginated,
} from '@forge/core';
import { ContentVersion } from 'src/app/core/models/content/content-version';


@Component({
  selector: 'fge-version-history-modal',
  templateUrl: './version-history-modal.component.html',
})
export class VersionHistoryModalComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('accordion') accordeon: NgbAccordion;


  applicationInfo: Application;
  contentData: ApplicationContent;

  private isAliveComponent = true;
  versions: ContentVersion[];

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<State>,
    private contentService: ContentService
  ) {}

  ngOnInit() {
    this.initSelectors();
  }

  ngAfterViewInit() {
    this.accordeon.panelChange.subscribe((panel: NgbPanelChangeEvent) => {
      const versionNumber = parseInt(panel.panelId.substr(1), 32);
      const versionItem = this.versions.find(v => v.version === versionNumber);
      if (versionItem.value) { return; }
      this.contentService.getContentVersion(this.applicationInfo.id, this.contentData.id, versionNumber).subscribe(response => {
        versionItem.value = response.data.value;
      });

    });
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  handleCancel(): void {
    this.activeModal.close();
  }

  copyVersion(contentVersion: ContentVersion) {
    this.activeModal.close(contentVersion);

  }
  private initSelectors(): void {
    this.handleApplicationInfo(this.store.select(getApplicationInfo));
  }

  private handleApplicationInfo(appInfo$: Observable<Application>): void {
    appInfo$
      .pipe(takeWhile(() => this.isAliveComponent))
      .subscribe((applicationInfo: Application) => {
        this.applicationInfo = applicationInfo;

        this.contentService.getContentVersionHistory(this.applicationInfo.id, this.contentData.id).subscribe(
          (response: ApiResponse<DataPaginated<ContentVersion>>) => {

          this.versions = response.data.items.map(item => {
            return {...item, value : item.version === this.contentData.currentVersion ? this.contentData.value : null }; });

        });

      });
  }
}
