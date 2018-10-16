import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-html',
  templateUrl: './content-type-html.component.html',
})
export class ContentTypeHtmlComponent implements OnInit {

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
