import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-logo',
  templateUrl: './content-type-logo.component.html',
})
export class ContentTypeLogoComponent implements OnInit {

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
