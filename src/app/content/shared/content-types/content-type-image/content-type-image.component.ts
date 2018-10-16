import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-image',
  templateUrl: './content-type-image.component.html',
})
export class ContentTypeImageComponent implements OnInit {

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
