"use strict";
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var injuryreport_service_1 = require('../services/injuryreport.service');
var session_service_1 = require('../services/session.service');
var settings_service_1 = require('../services/settings.service');
var router_2 = require('nativescript-angular/router');
var platform_1 = require("platform");
var InjuryReportsComponent = (function () {
    function InjuryReportsComponent(_injuryReportService, router, _routerExtensions, _settingsService, _sessionService) {
        this._injuryReportService = _injuryReportService;
        this.router = router;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._sessionService = _sessionService;
        this.injuryReports = [];
        this.columns = [];
        this.alerts = [];
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 90;
        this.user = _sessionService.getUser();
        this.padding = _settingsService.getPadding();
    }
    InjuryReportsComponent.prototype.ngAfterViewInit = function () {
        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;
        this._sessionService.console("after View Init");
    };
    InjuryReportsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.loadingData = true;
        this.isBusy = true;
        this.user.injuryReportReferenceNumber = "";
        this.user.injuryReportStatusID = 0;
        this.user.injuredUser = this.injuredUser;
        this.user.activeUser = this.activeUser;
        this._injuryReportService.getUserInjuryReports(this.user)
            .subscribe(function (user) { return _this.getUserInjuryReportsOnSuccess(user); }, function (error) { return _this.getUserInjuryReportsOnError(error); });
    };
    InjuryReportsComponent.prototype.getUserInjuryReportsOnSuccess = function (injuryReports) {
        var _this = this;
        for (var _i = 0, injuryReports_1 = injuryReports; _i < injuryReports_1.length; _i++) {
            var injuryReport = injuryReports_1[_i];
            this._sessionService.console(injuryReport.status);
            this.injuryReports.push(injuryReport);
        }
        this.listViewControl.refresh();
        setTimeout(function () {
            _this.loadingData = false;
            _this.isBusy = false;
        }, 100);
        this._sessionService.console("Done");
    };
    InjuryReportsComponent.prototype.getUserInjuryReportsOnError = function (error) {
        this.isBusy = true;
        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    InjuryReportsComponent.prototype.new = function () {
        this._sessionService.setSelectedIncidentReportString(null);
        this._sessionService.setInjuredEmployee(null);
        this._sessionService.setInjuryReport(null);
        this._sessionService.setInjuryType(null);
        this._sessionService.setBodyPartsLoadedForIncident(false);
        this._sessionService.setInitialLoadOfPhotos(true);
        this._sessionService.setReadOnly(false);
        this._sessionService.setShowEditButton(false);
        this._sessionService.setTakeOwnershipButton(false);
        var originalPhotos = [];
        var newPhotos = [];
        this._sessionService.setOriginalPhotos(originalPhotos);
        this._sessionService.savePhotos(newPhotos);
        this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    InjuryReportsComponent.prototype.onItemTap = function (args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        var index = args.index;
        var injuryReport = this.injuryReports[index];
        this._sessionService.setSelectedIncidentReportString(injuryReport.injuryReportIDStr);
        this._sessionService.setBodyPartsLoadedForIncident(false);
        this._sessionService.setInitialLoadOfPhotos(true);
        this._sessionService.setInjuryType(null);
        this._sessionService.console("status=" + injuryReport.status);
        this._sessionService.setReadOnly(true);
        this._sessionService.setShowEditButton(false);
        this._sessionService.setTakeOwnershipButton(false);
        this._sessionService.setLockedByUser("");
        if (injuryReport.status == "Incomplete") {
            this._sessionService.console(this.user.userID + "*" + injuryReport.lockedByUserID);
            if (this.user.userID == injuryReport.lockedByUserID) {
                this._sessionService.console("match");
                this._sessionService.setShowEditButton(true);
                this._sessionService.console("show edit button");
            }
            else {
                this._sessionService.setTakeOwnershipButton(true);
                this._sessionService.setLockedByUser(injuryReport.activeUser);
            }
        }
        var originalPhotos = [];
        var newPhotos = [];
        this._sessionService.setOriginalPhotos(originalPhotos);
        this._sessionService.savePhotos(newPhotos);
        this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    InjuryReportsComponent.prototype.ngOnDestroy = function () {
    };
    InjuryReportsComponent.prototype.logout = function () {
        this.isBusy = true;
        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    __decorate([
        core_1.ViewChild("listView"), 
        __metadata('design:type', core_1.ElementRef)
    ], InjuryReportsComponent.prototype, "listView", void 0);
    InjuryReportsComponent = __decorate([
        core_1.Component({
            templateUrl: 'injuryReport/injury-reports.component.html',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [injuryreport_service_1.InjuryReportService, router_1.Router, router_2.RouterExtensions, settings_service_1.SettingsService, session_service_1.SessionService])
    ], InjuryReportsComponent);
    return InjuryReportsComponent;
}());
exports.InjuryReportsComponent = InjuryReportsComponent;
//# sourceMappingURL=injury-reports.component.js.map