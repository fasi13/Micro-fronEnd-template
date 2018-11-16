import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, SearchApplication, ApplicationPath, isLoadingSearchApplication, getSearchApplicationList, getApplicationPath } from '@forge/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { FormField } from '../../models/form-field.abstract';

@Component({
  selector: 'fge-field-search-application',
  templateUrl: './field-search-application.component.html'
})
export class FieldSearchApplicationComponent extends FormField implements OnInit {
  loading$: Observable<boolean>;
  items$: Observable<ApplicationPath[]>;
  search: string;
  applicationId: number;
  currentControl: any;
  openResults = false;

  private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private store: Store<State>
    ) {
      super();
    }

  ngOnInit() {
    this.initSelectors();
    this.currentControl = this.group.controls[this.config.name];
    this.searchSubject.
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((keyword: string) =>
        this.store.dispatch(new SearchApplication(keyword))
      );
    this.store.select(getApplicationPath)
    .subscribe((applicationResponse) => {
      const application = applicationResponse.data[applicationResponse.data.length - 1];
      this.search = application['name'];
      this.applicationId = application['id'];
    });
  }

  onValueChanges(event: Event): void {
    event.preventDefault();
    if (this.search.length > 2) {
      this.searchSubject.next(this.search);
    }
  }

  onFocusInput(event: Event): void {
    event.preventDefault();
    this.openResults = true;
  }

  onFocusOutInput(event: Event): void {
    event.preventDefault();
    setTimeout(() => {
      this.openResults = false;
    }, 200);
  }

  getApplicationName({ path }: ApplicationPath): string {
    return path[path.length - 1].name;
  }

  getApplicationValue({ path }: ApplicationPath): string | number {
    const value = path[path.length - 1].value;
    return value || '';
  }

  getApplicationId({ path }: ApplicationPath): number {
    return +path[path.length - 1].id;
  }

  getApplicationPath(application: ApplicationPath): string {
    const appPath = application.path;
    let strPath = '';
    appPath.slice(0, appPath.length - 1).forEach((element, index, array) => {
      if (element) {
        const separator = index === array.length - 1 ? '' : '>';
        const elementId = (element && +element.value > -1) ? `(${element.value})` : '';
        strPath += `${element.name}${elementId}${separator}`;
      }
    });
    return strPath;
  }

  setApplicationName(application: ApplicationPath): void {
    const applicationSelected = application.path[application.path.length - 1];
    this.search = applicationSelected.name;
    this.applicationId = +applicationSelected.id;
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingSearchApplication);
    this.items$ = this.store.select(getSearchApplicationList);
  }
}
