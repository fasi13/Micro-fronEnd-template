import { Component,  Input } from '@angular/core';

@Component({
  selector: 'fge-splash-screen',
  templateUrl: './splash-screen.component.html'
})
export class SplashScreenComponent   {

  @Input()
  enabled: boolean = true;

 

}
