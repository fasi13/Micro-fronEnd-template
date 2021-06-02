import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-role-permissions',
  templateUrl: './role-permissions.component.html',
})
export class RolePermissionsComponent   {

  @Input() permissions: any;


  onClickPermissionSection($event: Event, section: any): void {
    $event.stopPropagation();
    if (section) {
      section.opened = !section.opened;
    }
  }

  onClickPermissionItem($event: Event, permission: any): void {
    $event.stopPropagation();
    if (permission) {
      permission.enabled = !permission.enabled;
    }
  }

}
