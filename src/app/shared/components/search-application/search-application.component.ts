import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, SearchApplication, ApplicationPath, isLoadingSearchApplication, getSearchApplicationList } from '@forge/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormField } from '../dynamic-form/models/form-field.abstract';

@Component({
  selector: 'fge-search-application',
  templateUrl: './search-application.component.html',
})
export class SearchApplicationComponent extends FormField implements OnInit {

  @Input() isInputForm: boolean;
  @Input() defaultName: string;
  @Output() applicationId = new EventEmitter<number>();

  loading$: Observable<boolean>;
  items$: Observable<ApplicationPath[]>;
  search: string;
  openResults = false;

  private searchSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(
    private store: Store<State>
  ) {
    super();
  }

  ngOnInit() {
    this.initSelectors();
    this.search = this.defaultName;
    this.searchSubject.
      pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((keyword: string) =>
        this.store.dispatch(new SearchApplication(keyword))
      );
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
        const separator = index === array.length - 1 ? '' : '>';
        const elementId = (element && +element.value > -1) ? `(${element.value})` : '';
        strPath += `${element.name}${elementId}${separator}`;
      }
    });
    return strPath;
  }

  updateInput({ path }: ApplicationPath): void {
    this.applicationId.emit(+path[path.length - 1].id);
    this.search = path[path.length - 1].name;
  }

  private initSelectors(): void {
    this.loading$ = this.store.select(isLoadingSearchApplication);
    this.items$ = this.store.select(getSearchApplicationList);
  }
}
