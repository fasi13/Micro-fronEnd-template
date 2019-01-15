import { Component, OnInit } from '@angular/core';
import { FgeRouterService } from '@forge/core';

@Component({
  selector: 'fge-group-not-found',
  templateUrl: './group-not-found.component.html',
})
export class GroupNotFoundComponent implements OnInit {

  constructor(
    private fgeRouter: FgeRouterService
  ) { }

  ngOnInit() {
  }

  goToContentManagement() {
    this.fgeRouter.navigate('content');
  }

}
