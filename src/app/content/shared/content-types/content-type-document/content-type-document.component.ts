import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-document',
  templateUrl: './content-type-document.component.html',
})
export class ContentTypeDocumentComponent implements OnInit {

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
