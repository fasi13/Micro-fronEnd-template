import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-image',
  templateUrl: './content-type-image.component.html',
})
export class ContentTypeImageComponent   {

  @Input()
  value: string;

  

}
