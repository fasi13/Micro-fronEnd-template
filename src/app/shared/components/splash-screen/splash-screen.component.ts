import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-splash-screen',
  templateUrl: './splash-screen.component.html'
})
export class SplashScreenComponent implements OnInit {

  @Input()
  enabled: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
