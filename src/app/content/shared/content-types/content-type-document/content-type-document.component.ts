import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-document',
  templateUrl: './content-type-document.component.html',
})
export class ContentTypeDocumentComponent   {

  @Input()
  value: string;



}
