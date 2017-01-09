"use strict";
var core_1 = require("@angular/core");
var user_service_1 = require("../services/user.service");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var router_1 = require('nativescript-angular/router');
var IncidentDatePickerComponent = (function () {
    function IncidentDatePickerComponent(_sessionService, _userService, _routerExtensions, _settingsService, _helperService) {
        this._sessionService = _sessionService;
        this._userService = _userService;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._helperService = _helperService;
        this.isReadOnly = false;
        this.injuryReport = _sessionService.getInjuryReport();
        this.isReadOnly = this._sessionService.getReadOnly();
    }
    IncidentDatePickerComponent.prototype.ngOnInit = function () {
    };
    IncidentDatePickerComponent.prototype.ngAfterViewInit = function () {
        this.datePickerControl = this.datePicker.nativeElement;
        this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);
        var dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);
        this._sessionService.console(dateOfIncident);
        var newDate = new Date(dateOfIncident);
        this._sessionService.console("javascript incident date = " + newDate);
        this.datePickerControl.date = newDate;
    };
    IncidentDatePickerComponent.prototype.save = function () {
        this.injuryReport.dateOfIncident = this.datePickerControl.date;
        this._sessionService.setIsDirty(true);
        this._sessionService.setInjuryReport(this.injuryReport);
        this.back();
    };
    IncidentDatePickerComponent.prototype.back = function () {
        this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    __decorate([
        core_1.ViewChild('dp'), 
        __metadata('design:type', core_1.ElementRef)
    ], IncidentDatePickerComponent.prototype, "datePicker", void 0);
    IncidentDatePickerComponent = __decorate([
        core_1.Component({
            selector: "incident-date-picker",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/incident-date-picker.component.html",
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, user_service_1.UserService, router_1.RouterExtensions, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], IncidentDatePickerComponent);
    return IncidentDatePickerComponent;
}());
exports.IncidentDatePickerComponent = IncidentDatePickerComponent;
//# sourceMappingURL=incident-date-picker.component.js.map