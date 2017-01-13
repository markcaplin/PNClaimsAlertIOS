"use strict";
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var injuryreport_service_1 = require('../services/injuryreport.service');
var session_service_1 = require('../services/session.service');
var settings_service_1 = require('../services/settings.service');
var router_2 = require('nativescript-angular/router');
var platform_1 = require("platform");
var SelectInjuryTypeComponent = (function () {
    function SelectInjuryTypeComponent(_injuryReportService, router, _routerExtensions, _settingsService, _sessionService) {
        this._injuryReportService = _injuryReportService;
        this.router = router;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._sessionService = _sessionService;
        this.injuryTypes = [];
        this.columns = [];
        this.alerts = [];
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 90;
        this.padding = this._settingsService.getPadding();
    }
    SelectInjuryTypeComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;
        this._sessionService.console("after View Init " + this.listViewControl);
        var injuryTypes = this._sessionService.getInjuryTypes();
        this._sessionService.console("injury types = " + injuryTypes.length);
        if (injuryTypes.length > 0) {
            for (var _i = 0, injuryTypes_1 = injuryTypes; _i < injuryTypes_1.length; _i++) {
                var injuryType = injuryTypes_1[_i];
                this.injuryTypes.push(injuryType);
            }
            this.listViewControl.refresh();
            return;
        }
        this.loadingData = true;
        this.isBusy = true;
        this._injuryReportService.getInjuryTypes()
            .subscribe(function (response) { return _this.getInjuryTypesOnSuccess(response); }, function (error) { return _this.getInjuryTypesOnError(error); });
    };
    SelectInjuryTypeComponent.prototype.getInjuryTypesOnSuccess = function (response) {
        var _this = this;
        for (var _i = 0, response_1 = response; _i < response_1.length; _i++) {
            var injuryType = response_1[_i];
            this.injuryTypes.push(injuryType);
        }
        this._sessionService.saveInjuryTypes(this.injuryTypes);
        this.listViewControl.refresh();
        setTimeout(function () {
            _this.loadingData = false;
            _this.isBusy = false;
        }, 100);
        this._sessionService.console("Done");
    };
    SelectInjuryTypeComponent.prototype.getInjuryTypesOnError = function (response) {
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
    SelectInjuryTypeComponent.prototype.onItemTap = function (args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        var index = args.index;
        var injuryType = this.injuryTypes[index];
        this._sessionService.setInjuryType(injuryType);
        this._sessionService.setIsDirty(true);
        this.back();
    };
    SelectInjuryTypeComponent.prototype.ngOnDestroy = function () {
    };
    SelectInjuryTypeComponent.prototype.back = function () {
        this._routerExtensions.navigate(["/injuryreport/additionalquestions"], {
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
    ], SelectInjuryTypeComponent.prototype, "listView", void 0);
    SelectInjuryTypeComponent = __decorate([
        core_1.Component({
            templateUrl: 'injuryReport/select-injury-type.component.html',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [injuryreport_service_1.InjuryReportService, router_1.Router, router_2.RouterExtensions, settings_service_1.SettingsService, session_service_1.SessionService])
    ], SelectInjuryTypeComponent);
    return SelectInjuryTypeComponent;
}());
exports.SelectInjuryTypeComponent = SelectInjuryTypeComponent;
//# sourceMappingURL=select-injury-type.component.js.map