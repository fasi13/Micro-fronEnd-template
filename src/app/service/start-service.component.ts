import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FgeRouterService } from '../core/services';
@Component({
  template: ''
})
export class StartServiceComponent implements OnInit  {
  constructor(private route: ActivatedRoute, private router: FgeRouterService) {}
  ngOnInit() {
    this.router.navigate('/service/' + this.route.snapshot.params['serviceName'], {replaceUrl: true});
  }
}
