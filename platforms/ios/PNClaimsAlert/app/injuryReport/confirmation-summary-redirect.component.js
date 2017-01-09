"use strict";
var core_1 = require("@angular/core");
var injuryreport_model_1 = require("../models/injuryreport.model");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var injuryreport_service_1 = require('../services/injuryreport.service');
var router_1 = require('nativescript-angular/router');
var platform_1 = require("platform");
var dialogs = require("ui/dialogs");
var ConfirmationSummaryRedirectComponent = (function () {
    function ConfirmationSummaryRedirectComponent(_sessionService, _routerExtensions, _injuryReportService, _settingsService, _helperService) {
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
        this.showErrorMessage = this._sessionService.getShowSummaryPageError();
        this.messageBox = this._sessionService.getSummaryPageError();
        this._sessionService.console("message from redirect =" + this.messageBox);
        this._sessionService.console("show error = " + this.showErrorMessage);
        //this._sessionService.setSummaryPageError("");
        //this._sessionService.setShowSummaryPageError(false);
        this.showErrorMessage = false;
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 125;
        this.injuryReport = this._sessionService.getInjuryReport();
        this.injuryType = this._sessionService.getInjuryType();
        this.showTypeOfInjury = false;
        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
                this.showTypeOfInjury = true;
            }
        }
        if (this.injuryReport.injuryAtWorkplaceSelected == true) {
            if (this.injuryReport.injuryOccuredAtWorkplace == true) {
                this.injuryOccuredAtWorkplace = "Yes";
                this.injuryOccurredAtWorkYes = true;
                this.injuryOccurredAtWorkNo = false;
                this.showExplainInjuryLocation = false;
            }
            else {
                this.injuryOccuredAtWorkplace = "No";
                this.injuryOccurredAtWorkYes = false;
                this.injuryOccurredAtWorkNo = true;
                this.showExplainInjuryLocation = true;
            }
        }
        if (this.injuryReport.needMedicalAttentionSelected == true) {
            if (this.injuryReport.needMedicalAttention == true) {
                this.needMedicalAttention = "Yes";
                this.needMedicalAttentionYes = true;
                this.needMedicalAttentionNo = false;
            }
            else {
                this.needMedicalAttention = "No";
                this.needMedicalAttentionYes = false;
                this.needMedicalAttentionNo = true;
            }
        }
        this.showCannotContinueWorking = false;
        if (this.injuryReport.canContinueWorkingSelected == true) {
            if (this.injuryReport.canContinueWorking == true) {
                this.canContinueWorking = "Yes";
                this.continueWorkingYes = true;
                this.continueWorkingNo = false;
            }
            else {
                this.canContinueWorking = "No";
                this.showCannotContinueWorking = true;
                this.continueWorkingYes = false;
                this.continueWorkingNo = true;
            }
        }
        this._sessionService.console("Constructor end");
    }
    ConfirmationSummaryRedirectComponent.prototype.ngAfterViewInit = function () {
        //this.listViewControl = this.listView.nativeElement;
        //this.listViewControl.height = 10;
    };
    ConfirmationSummaryRedirectComponent.prototype.injuryOccurredAtWork = function (selectedValue) {
        this.injuryOccuredAtWorkplace = selectedValue;
        this.injuryReport.injuryAtWorkplaceSelected = true;
        this.injuryReport.injuryOccuredAtWorkplace = false;
        if (selectedValue == "Yes") {
            this.injuryReport.injuryOccuredAtWorkplace = true;
            this.injuryOccurredAtWorkYes = true;
            this.injuryOccurredAtWorkNo = false;
            this.showExplainInjuryLocation = false;
        }
        else {
            this.injuryOccurredAtWorkYes = false;
            this.injuryOccurredAtWorkNo = true;
            this.showExplainInjuryLocation = true;
        }
    };
    ConfirmationSummaryRedirectComponent.prototype.medicalAttentionNeeded = function (selectedValue) {
        this.needMedicalAttention = selectedValue;
        this.injuryReport.needMedicalAttentionSelected = true;
        this.injuryReport.needMedicalAttention = false;
        if (selectedValue == "Yes") {
            this.injuryReport.needMedicalAttention = true;
            this.needMedicalAttentionYes = true;
            this.needMedicalAttentionNo = false;
        }
        else {
            this.needMedicalAttentionYes = false;
            this.needMedicalAttentionNo = true;
        }
    };
    ConfirmationSummaryRedirectComponent.prototype.continueWorking = function (selectedValue) {
        this.canContinueWorking = selectedValue;
        this.injuryReport.canContinueWorking = false;
        this.injuryReport.canContinueWorkingSelected = true;
        this.showCannotContinueWorking = true;
        if (selectedValue == "Yes") {
            this.injuryReport.canContinueWorking = true;
            this.showCannotContinueWorking = false;
            this.continueWorkingYes = true;
            this.continueWorkingNo = false;
        }
        else {
            this.continueWorkingYes = false;
            this.continueWorkingNo = true;
        }
    };
    ConfirmationSummaryRedirectComponent.prototype.submit = function () {
        var _this = this;
        this.showErrorMessage = false;
        var injuryReport = new injuryreport_model_1.InjuryReport();
        injuryReport.injuryReportID = this.injuryReport.injuryReportID;
        this._injuryReportService.submitToEmployer(this.injuryReport)
            .subscribe(function (submit) { return _this.submitToEmployerOnSuccess(submit); }, function (error) { return _this.submitToEmployerOnError(error); });
    };
    ConfirmationSummaryRedirectComponent.prototype.submitToEmployerOnSuccess = function (response) {
        this._sessionService.setSummaryPageError("");
        this._sessionService.setShowSummaryPageError(false);
        this._routerExtensions.navigate(["/injuryreport/thankyou"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    ConfirmationSummaryRedirectComponent.prototype.submitToEmployerOnError = function (response) {
        this._sessionService.console("show error messages...");
        var errorMessage = "";
        this.showErrorMessage = true;
        for (var i = 0; i < response.returnMessage.length; i++) {
            errorMessage = errorMessage + response.returnMessage[i] + "\n";
            this._sessionService.console(response.returnMessage[i]);
        }
        //  this._ngZone.run(() => {                  
        //  })
        //this.messageBox = errorMessage + "DAMN 2";
        dialogs.alert({
            title: "Submission Invalid.",
            message: errorMessage,
            okButtonText: "OK"
        }).then(function () {
        });
        this.messageBox = errorMessage;
        //this._sessionService.console("message box = " + this.messageBox);
        this._sessionService.setSummaryPageError(errorMessage);
        this._sessionService.setShowSummaryPageError(true);
        this._routerExtensions.navigate(["/injuryreport/confirmationsummary"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    ConfirmationSummaryRedirectComponent.prototype.back = function () {
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
    ], ConfirmationSummaryRedirectComponent.prototype, "listView", void 0);
    ConfirmationSummaryRedirectComponent = __decorate([
        core_1.Component({
            selector: "confirmation-summary-redirect",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/confirmation-summary-redirect.component.html",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.RouterExtensions, injuryreport_service_1.InjuryReportService, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], ConfirmationSummaryRedirectComponent);
    return ConfirmationSummaryRedirectComponent;
}());
exports.ConfirmationSummaryRedirectComponent = ConfirmationSummaryRedirectComponent;
//# sourceMappingURL=confirmation-summary-redirect.component.js.map