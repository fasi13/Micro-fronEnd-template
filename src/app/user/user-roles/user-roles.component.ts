import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { takeWhile } from 'rxjs/operators';

import { State, FetchRoles, getRoles, FetchRolePermissions, FetchRoleUsers } from '@forge/core';
import { UserRole } from 'src/app/core/models/user/user-role.model';

@Component({
  selector: 'fge-user-roles',
  templateUrl: './user-roles.component.html',
})
export class UserRolesComponent implements OnInit, OnDestroy {

  selectedContainer: string;
  rolesState: any;

  private isAliveComponent = true;

  constructor(
    private store: Store<State>
  ) { }

  ngOnInit() {
    this.initDispatchers();
    this.initSelectors();
  }

  ngOnDestroy() {
    this.isAliveComponent = false;
  }

  showContainerFor($event: Event, role: UserRole, containerName: string = 'permissions'): void {
    $event.stopPropagation();
    const { selected = {} } = this.rolesState;
    if (this.selectedContainer === containerName && role.id === selected.id) {
      delete this.rolesState.selected;
    } else {
      this.selectedContainer = containerName;
      this.setSelectedRole(role);
    }
  }

  setSelectedRole(role?: UserRole): void {
    this.selectedContainer = this.selectedContainer || 'permissions';
    this.fetchDataFor(this.selectedContainer, role);
  }

  deleteConfirmation(event: Event, confirmModal: any): void {
    if (event) {
      event.stopPropagation();
    }
    const config = {
      title: 'Delete Role Modal Confirmation',
      message: `Do you want to delete the role /$/{role.name}?`,
      submitLabel: 'Accept',
      cancelLabel: 'Cancel',
      payload: { id: 'TBD' }
    };
    confirmModal.open(config);
  }

  onDeleteRole(payload: any, confirmModal: any): void {
    console.log(`OnDelete called with payload: ${payload}`);
    confirmModal.close();
  }

  private initDispatchers(): void {
    this.store.dispatch(new FetchRoles());
  }

  private initSelectors(): void {
    this.store.select(getRoles)
      .pipe(
        takeWhile(() => this.isAliveComponent)
      )
      .subscribe((rolesState: any) => {
        this.rolesState = rolesState;
      });
  }

  private fetchDataFor(containerName: string, role: UserRole) {
    if (containerName === 'permissions') {
      this.store.dispatch(new FetchRolePermissions(role));
    } else {
      this.store.dispatch(new FetchRoleUsers(role));
    }
  }
}
