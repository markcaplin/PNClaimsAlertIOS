"use strict";
var core_1 = require("@angular/core");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var injuryreport_service_1 = require('../services/injuryreport.service');
var router_1 = require('nativescript-angular/router');
var platform_1 = require("platform");
var ThankYouComponent = (function () {
    function ThankYouComponent(_sessionService, _routerExtensions, _injuryReportService, _settingsService, _helperService) {
        this._sessionService = _sessionService;
        this._routerExtensions = _routerExtensions;
        this._injuryReportService = _injuryReportService;
        this._settingsService = _settingsService;
        this._helperService = _helperService;
        this.injuryOccurredAtWorkYes = false;
        this.injuryOccurredAtWorkNo = false;
        this.needMedicalAttentionYes = false;
        this.needMedicalAttentionNo = false;
        this.continueWorkingYes = false;
        this.continueWorkingNo = false;
        this.showExplainInjuryLocation = false;
        this.errorMessages = [];
        this.errors = [];
        this._sessionService.console("Constructor begin");
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 100;
        this.injuryReport = this._sessionService.getInjuryReport();
        this.injuryType = this._sessionService.getInjuryType();
        this.messageBox = "Thank you for submitting your incident report. No further action is required on your part and you should contact your employer for further information regarding your incident.";
        this._sessionService.console("Constructor end");
        this._sessionService.setReadOnly(true);
    }
    ThankYouComponent.prototype.ngAfterViewInit = function () {
    };
    ThankYouComponent.prototype.back = function () {
        this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    __decorate([
        core_1.ViewChild("listView"), 
        __metadata('design:type', core_1.ElementRef)
    ], ThankYouComponent.prototype, "listView", void 0);
    ThankYouComponent = __decorate([
        core_1.Component({
            selector: "thank-you",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/thank-you.component.html",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.RouterExtensions, injuryreport_service_1.InjuryReportService, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], ThankYouComponent);
    return ThankYouComponent;
}());
exports.ThankYouComponent = ThankYouComponent;
//# sourceMappingURL=thank-you.component.js.map