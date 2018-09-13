import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fge-sidebar',
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {

  @Input()
  active: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  onToggleSidebar() {
    this.active = !this.active;
  }

}
