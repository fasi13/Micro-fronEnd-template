import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import _ceil from 'lodash/ceil';

import { ApplicationPath } from '@forge/core';

@Component({
  selector: 'fge-bread-crumb',
  templateUrl: './bread-crumb.component.html'
})
export class BreadCrumbComponent implements OnChanges {

  @Input() pathData: ApplicationPath[];
  @Input() maxPathsToShow: number;
  @Output() readonly clickLastPath: EventEmitter<Event> = new EventEmitter<Event>();

  pathList: ApplicationPath[] = [];
  ellipsisPosition: number;
  fullPath: string;

  constructor() {}

  ngOnChanges() {
    if (this.pathData) {
      this.ellipsisPosition = this.pathData.length > this.maxPathsToShow ? _ceil(this.maxPathsToShow / 2) : -1;
      if (this.ellipsisPosition > 0) {
        const limitPosition = this.pathData.length + this.ellipsisPosition - this.maxPathsToShow;
        let position = 0;
        this.pathData.forEach(path => {
          if (position <= this.ellipsisPosition || position >= limitPosition) {
            this.pathList.push(path);
          }
          this.generatefullPath(path['name']);
          position++;
        });
      } else {
        this.pathList = this.pathData;
      }
    }
  }

  onClickPath(event: Event) {
    this.clickLastPath.emit(event);
  }

  private generatefullPath(pathName: string): void {
    this.fullPath = this.fullPath ? `${this.fullPath} / ${pathName}` : pathName;
  }

}
