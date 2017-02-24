"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var application_list_component_1 = require("./application-list/application-list.component");
var application_component_1 = require("./application/application.component");
var routes = [
    { path: 'applications', component: application_list_component_1.ApplicationListComponent },
    { path: 'applications/:key', component: application_component_1.ApplicationComponent }
];
var ApplicationsRoutingModule = (function () {
    function ApplicationsRoutingModule() {
    }
    return ApplicationsRoutingModule;
}());
ApplicationsRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule]
    }),
    __metadata("design:paramtypes", [])
], ApplicationsRoutingModule);
exports.ApplicationsRoutingModule = ApplicationsRoutingModule;
//# sourceMappingURL=applications-routing.module.js.map