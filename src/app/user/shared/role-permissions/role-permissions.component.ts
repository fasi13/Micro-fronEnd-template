import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'fge-role-permissions',
  templateUrl: './role-permissions.component.html',
})
export class RolePermissionsComponent implements OnInit {

  /** @TODO Define the proper type for each section */
  sections: any[];

  constructor() { }

  ngOnInit() {
    this.sections = [{
      id: 1,
      name: 'Content Management',
      permissions: [
        {
          id: 1,
          name: 'Permission 1',
          enabled: true
        }, {
          id: 2,
          name: 'Permission 2',
          enabled: false
        }, {
          id: 3,
          name: 'Permission 3',
          enabled: false
        }, {
          id: 4,
          name: 'Permission 4',
          enabled: true
        }, {
          id: 5,
          name: 'Permission 5',
          enabled: false
        }, {
          id: 6,
          name: 'Permission 6',
          enabled: true
        }, {
          id: 7,
          name: 'Permission 7',
          enabled: false
        }
      ]
    }, {
      id: 2,
      name: 'Categories Overwrite',
      permissions: [
        {
          id: 1,
          name: 'Permission A',
          enabled: false
        }, {
          id: 2,
          name: 'Permission B',
          enabled: false
        }, {
          id: 3,
          name: 'Permission C',
          enabled: false
        }, {
          id: 4,
          name: 'Permission D',
          enabled: true
        }, {
          id: 5,
          name: 'Permission E',
          enabled: false
        }, {
          id: 6,
          name: 'Permission F',
          enabled: false
        }, {
          id: 7,
          name: 'Permission G',
          enabled: false
        }
      ]
    }, {
      id: 3,
      name: 'Promotions',
      permissions: [
        {
          id: 1,
          name: 'Permission A1',
          enabled: true
        }, {
          id: 2,
          name: 'Permission B2',
          enabled: true
        }, {
          id: 3,
          name: 'Permission C3',
          enabled: true
        }, {
          id: 4,
          name: 'Permission D4',
          enabled: false
        }, {
          id: 5,
          name: 'Permission E5',
          enabled: false
        }, {
          id: 6,
          name: 'Permission F6',
          enabled: false
        }, {
          id: 7,
          name: 'Permission G7',
          enabled: true
        }
      ]
    }, {
      id: 4,
      name: 'Banners',
      permissions: [
        {
          id: 1,
          name: 'Permission AA',
          enabled: false
        }, {
          id: 2,
          name: 'Permission BB',
          enabled: false
        }, {
          id: 3,
          name: 'Permission CC',
          enabled: true
        }, {
          id: 4,
          name: 'Permission DD',
          enabled: true
        }, {
          id: 5,
          name: 'Permission EE',
          enabled: false
        }, {
          id: 6,
          name: 'Permission FF',
          enabled: true
        }, {
          id: 7,
          name: 'Permission GG',
          enabled: true
        }
      ]
    }];
  }

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
