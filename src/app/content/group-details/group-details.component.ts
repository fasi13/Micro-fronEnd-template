import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'fge-group-details',
  templateUrl: './group-details.component.html'
})
export class GroupDetailsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

}
