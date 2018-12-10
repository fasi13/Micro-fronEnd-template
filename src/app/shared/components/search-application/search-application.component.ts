import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { State, SearchApplication, ApplicationPath, isLoadingSearchApplication, getSearchApplicationList } from '@forge/core';

@Component({
  selector: 'fge-search-application',
  templateUrl: './search-application.component.html',
})
export class SearchApplicationComponent implements OnInit {

  loading$: Observable<boolean>;
  items$: Observable<ApplicationPath[]>;
  search: string;
  openResults = false;

  private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.initSelectors();
    this.searchSubject.
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((keyword: string) => {
        if (keyword) {
          this.store.dispatch(new SearchApplication(keyword));
        }
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

  getApplicationLink({ path }: ApplicationPath): string {
    return `/tenant/${path[path.length - 1].id}`;
  }

  getApplicationPath(application: ApplicationPath): string {
    const appPath = application.path;
    let strPath = '';
    appPath.slice(0, appPath.length - 1).forEach((element, index, array) => {
      if (element) {
        const separator = index === array.length - 1 ? '' : ' > ';
        const elementId = (element && +element.value > -1) ? ` (${element.value})` : '';
        strPath += `${element.name}${elementId}${separator}`;
      }
    });
    return strPath;
  }

  resetSearch() {
    this.search = '';
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingSearchApplication);
    this.items$ = this.store.select(getSearchApplicationList);
  }
}
