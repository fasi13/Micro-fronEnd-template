import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fge-user-roles',
  templateUrl: './user-roles.component.html',
})
export class UserRolesComponent implements OnInit {

  selectedRole: number;

  constructor() { }

  ngOnInit() {
  }

  toggleSelectedRole(id: number): void {
    if (this.selectedRole !== id) {
      this.selectedRole = id;
    } else {
      delete this.selectedRole;
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
