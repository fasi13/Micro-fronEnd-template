import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-content-type-text',
  templateUrl: './content-type-text.component.html',
})
export class ContentTypeTextComponent implements OnInit {

  @Input()
  value: string;

  constructor() { }

  ngOnInit() {
  }

}
