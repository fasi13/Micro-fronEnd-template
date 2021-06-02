import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-html',
  templateUrl: './content-type-html.component.html',
})
export class ContentTypeHtmlComponent  {

  @Input() value: string;
 @Input() renderer: boolean;

}
