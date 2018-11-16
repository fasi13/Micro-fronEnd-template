import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { State, ApplicationContent, getContent } from '@forge/core';
import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-html',
  templateUrl: './field-html.component.html'
})
export class FieldHtmlComponent extends FormField implements OnInit, OnDestroy {

  currentContent: ApplicationContent;

  private isAliveComponent = true;
  private routeParamsSubscription: Subscription;

  constructor(
    private store: Store<State>,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.routeParamsSubscription = this.route.params
      .subscribe(params => this.initContent(params.contentId));
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
    this.routeParamsSubscription.unsubscribe();
  }

  private initContent(contentId: string): void {
    if (contentId) {
      this.store.select(getContent)
        .pipe(
          takeWhile(() => this.isAliveComponent)
        )
        .subscribe((content: ApplicationContent) => this.currentContent = content);
    }
  }

}
