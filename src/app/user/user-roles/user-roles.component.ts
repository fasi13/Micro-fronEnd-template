import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fge-user-roles',
  templateUrl: './user-roles.component.html',
})
export class UserRolesComponent implements OnInit {

  selectedRole: number;
  selectedContainer: string = 'users' || 'permissions';

  constructor() { }

  ngOnInit() {
  }

  showContainerFor($event, containerName): void {
    if (this.selectedContainer) {
      $event.stopPropagation();
      if (this.selectedContainer === containerName) {
        this.toggleSelectedRole();
      } else {
        this.selectedContainer = containerName;
      }
    } else {
      this.toggleSelectedRole();
    }
  }

  toggleSelectedRole(id?: number): void {
    if (id && this.selectedRole !== id) {
      this.selectedRole = id;
      this.selectedContainer = this.selectedContainer || 'permissions';
    } else {
      delete this.selectedRole;
      delete this.selectedContainer;
    }
  }

  deleteConfirmation(event: Event, confirmModal: any): void {
    if (event) {
      event.stopPropagation();
    }
    const config = {
      title: 'Delete Role confirmation',
      message: `Do you want to delete the role named /$/{role.name}?`,
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
}
