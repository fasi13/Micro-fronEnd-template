import { Component } from '@angular/core';
import { FgeRouterService } from '@forge/core';

@Component({
  selector: 'fge-group-not-found',
  templateUrl: './group-not-found.component.html',
})
export class GroupNotFoundComponent   {

  constructor(
    private fgeRouter: FgeRouterService
  ) { }



  goToContentManagement() {
    this.fgeRouter.navigate('content');
  }

}
