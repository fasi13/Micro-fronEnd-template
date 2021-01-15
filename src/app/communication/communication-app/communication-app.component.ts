import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'fge-communication-app',
  templateUrl: './communication-app.component.html'
})
export class CommunicationAppComponent implements OnInit  {
  applicationId: number;
  constructor(private route: ActivatedRoute) {}
  ngOnInit() {
    this.applicationId = this.route.snapshot.params['tenantId'];
  }
}
