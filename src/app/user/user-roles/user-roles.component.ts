import { Component, OnInit } from '@angular/core';
import { UserRole } from 'src/app/core/models/user/user-role.model';

@Component({
  selector: 'fge-user-roles',
  templateUrl: './user-roles.component.html',
})
export class UserRolesComponent implements OnInit {

  selectedRole: number;
  selectedContainer: string = 'users' || 'permissions';
  roles: UserRole[];

  constructor() { }

  ngOnInit() {
    this.roles = [
      {
        id: 1,
        name: 'Administrator'
      }, {
        id: 2,
        name: 'Banners Administrator'
      }, {
        id: 3,
        name: 'Content Administrator'
      }
    ];
  }

  showContainerFor($event: Event, containerName: string, id: number): void {
    $event.stopPropagation();
    if (this.selectedContainer) {
      if (this.selectedContainer === containerName) {
        this.toggleSelectedRole();
      } else {
        this.selectedContainer = containerName;
      }
    } else {
      this.selectedContainer = containerName;
      this.toggleSelectedRole(id);
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
}
