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
      name: 'Content Management'
    }, {
      id: 2,
      name: 'Categories Overwrite'
    }, {
      id: 3,
      name: 'Promotions'
    }, {
      id: 4,
      name: 'Banners'
    }];
  }

}
