import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-text',
  templateUrl: './content-type-text.component.html',
})
export class ContentTypeTextComponent   {

  @Input() value: string;

  @Input() renderer: boolean;


 

}
