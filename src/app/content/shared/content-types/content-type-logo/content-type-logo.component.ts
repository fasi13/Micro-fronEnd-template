import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-logo',
  templateUrl: './content-type-logo.component.html',
})
export class ContentTypeLogoComponent   {

  @Input()
  value: string;

  

}
