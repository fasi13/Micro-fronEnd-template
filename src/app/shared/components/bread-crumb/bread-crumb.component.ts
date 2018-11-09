import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { takeWhile } from 'rxjs/operators';

import { State, getApplicationPath } from '@forge/core-store';
import { ApplicationPath } from '@forge/core';

@Component({
  selector: 'fge-bread-crumb',
  templateUrl: './bread-crumb.component.html'
})
export class BreadCrumbComponent implements OnInit, OnDestroy {

  paths: ApplicationPath[];

  private isAliveComponent = true;

  constructor(
    private store: Store<State>,
  ) { }

  ngOnInit() {
    this.initComponent();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  private initComponent(): void {
    this.store.select(getApplicationPath)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe(paths => this.paths = paths.data);
  }

}
