import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    moduleId: module.id,
    templateUrl: 'application.component.html'
})
export class ApplicationComponent implements OnInit {
    key: string;

    constructor(
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        this.route.params
            .subscribe((params: Params) => this.key = params['key']);
    }
}