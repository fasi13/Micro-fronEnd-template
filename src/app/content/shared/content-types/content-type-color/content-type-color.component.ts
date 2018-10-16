import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-color',
  templateUrl: './content-type-color.component.html',
})
export class ContentTypeColorComponent implements OnInit {

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
