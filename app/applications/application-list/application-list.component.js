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
var application_service_1 = require("../shared/application.service");
var ApplicationListComponent = (function () {
    function ApplicationListComponent(router, applicationService) {
        this.router = router;
        this.applicationService = applicationService;
    }
    ApplicationListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.applicationService.getApplications()
            .then(function (applications) { return _this.applications = applications; });
    };
    ApplicationListComponent.prototype.onEdit = function (application) {
        this.router.navigate(['applications/', application.key]);
    };
    return ApplicationListComponent;
}());
ApplicationListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: 'application-list.component.html',
        providers: [application_service_1.ApplicationService]
    }),
    __metadata("design:paramtypes", [router_1.Router,
        application_service_1.ApplicationService])
], ApplicationListComponent);
exports.ApplicationListComponent = ApplicationListComponent;
//# sourceMappingURL=application-list.component.js.map