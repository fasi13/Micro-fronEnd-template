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
var common_1 = require("@angular/common");
var applications_routing_module_1 = require("./applications-routing.module");
var application_list_component_1 = require("./application-list/application-list.component");
var application_component_1 = require("./application/application.component");
var ApplicationsModule = (function () {
    function ApplicationsModule() {
    }
    return ApplicationsModule;
}());
ApplicationsModule = __decorate([
    core_1.NgModule({
        imports: [common_1.CommonModule, applications_routing_module_1.ApplicationsRoutingModule],
        declarations: [application_list_component_1.ApplicationListComponent, application_component_1.ApplicationComponent],
        exports: [application_list_component_1.ApplicationListComponent, application_component_1.ApplicationComponent]
    }),
    __metadata("design:paramtypes", [])
], ApplicationsModule);
exports.ApplicationsModule = ApplicationsModule;
//# sourceMappingURL=applications.module.js.map