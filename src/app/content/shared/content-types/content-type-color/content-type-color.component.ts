import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-color',
  templateUrl: './content-type-color.component.html',
})
export class ContentTypeColorComponent   {

  @Input() value: string;
  @Input() renderer: string;
  

  

}
