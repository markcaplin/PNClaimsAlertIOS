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
var ConfirmationSummaryComponent = (function () {
    function ConfirmationSummaryComponent(_sessionService, _routerExtensions, _injuryReportService, _settingsService, _helperService) {
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
        this.bodyParts = [];
        this.isReadOnly = false;
        this.showEditButton = false;
        this.showTakeOwnershipButton = false;
        this.takingOwnership = false;
        this.padding = this._settingsService.getPadding();
        this._sessionService.console("Constructor begin");
        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();
        this.showErrorMessage = false;
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.injuryReport = this._sessionService.getInjuryReport();
        this.injuryType = this._sessionService.getInjuryType();
        this.injuredEmployee = _sessionService.getInjuredEmployee();
        this.injuredEmployeeName = this.injuredEmployee.firstName + " " + this.injuredEmployee.lastName;
        this.dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);
        var dateOfBirth = this._helperService.convertJsonDateToJavaScriptDate(this.injuredEmployee.dateOfBirth);
        this.dateOfBirth = this._helperService.formatDate(dateOfBirth);
        this.showTypeOfInjury = false;
        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
                this.showTypeOfInjury = true;
            }
        }
        if (this.injuryReport.injuryOccuredAtWorkplace != null) {
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
        if (this.injuryReport.needMedicalAttention != null) {
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
        if (this.injuryReport.canContinueWorking != null) {
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
        this.bodyParts = this.injuryReport.bodyParts;
        this.injuredAreas = "";
        for (var i = 0; i < this.bodyParts.length; i++) {
            if (i == 0) {
                this.injuredAreas = this.bodyParts[i].htmlTitle + " ";
            }
            else {
                this.injuredAreas = this.injuredAreas + " " + this.bodyParts[i].htmlTitle + " ";
            }
        }
        this._sessionService.console("Constructor end");
    }
    ConfirmationSummaryComponent.prototype.ngAfterViewInit = function () {
        //this.listViewControl = this.listView.nativeElement;
        //this.listViewControl.height = 10;
    };
    ConfirmationSummaryComponent.prototype.edit = function () {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    };
    ConfirmationSummaryComponent.prototype.unlock = function () {
        var _this = this;
        if (this.takingOwnership == true)
            return false;
        var lockedByUser = this._sessionService.getLockedByUser();
        dialogs.confirm({
            title: "Take Ownership",
            message: "This injury report is currently locked by " + lockedByUser + ". Do you wish to take ownership of this injury report?",
            okButtonText: "OK",
            cancelButtonText: "Cancel"
        }).then(function (result) {
            _this._sessionService.console("Dialog result: " + result);
            if (result == true) {
                var injuryReport = new injuryreport_model_1.InjuryReport();
                injuryReport.injuryReportIDStr = _this.injuryReport.injuryReportIDStr;
                _this.isBusy = true;
                _this.takingOwnership = true;
                _this._injuryReportService.lockInjuryReport(injuryReport)
                    .subscribe(function (request) { return _this.lockInjuryReportOnSuccess(request); }, function (error) { return _this.lockInjuryReportOnError(error); });
            }
        });
    };
    ConfirmationSummaryComponent.prototype.lockInjuryReportOnSuccess = function (injuryReport) {
        this.showEditButton = true;
        this.showTakeOwnershipButton = false;
        this._sessionService.setShowEditButton(true);
        this._sessionService.setTakeOwnershipButton(false);
        this.isBusy = false;
    };
    ConfirmationSummaryComponent.prototype.lockInjuryReportOnError = function (response) {
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
    ConfirmationSummaryComponent.prototype.injuryOccurredAtWork = function (selectedValue) {
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
    ConfirmationSummaryComponent.prototype.medicalAttentionNeeded = function (selectedValue) {
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
    ConfirmationSummaryComponent.prototype.continueWorking = function (selectedValue) {
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
    ConfirmationSummaryComponent.prototype.home = function () {
        var _this = this;
        this._sessionService.setIsDirty(false);
        setTimeout(function () {
            _this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
                clearHistory: true,
                transition: {
                    name: _this._settingsService.transitionSlideRight,
                    duration: _this._settingsService.transitionDuration,
                    curve: _this._settingsService.transitionCurve
                }
            });
        }, 100);
    };
    ConfirmationSummaryComponent.prototype.submit = function () {
        var _this = this;
        this.showErrorMessage = false;
        var injuryReport = new injuryreport_model_1.InjuryReport();
        injuryReport.injuryReportID = this.injuryReport.injuryReportID;
        this._injuryReportService.submitToEmployer(this.injuryReport)
            .subscribe(function (submit) { return _this.submitToEmployerOnSuccess(submit); }, function (error) { return _this.submitToEmployerOnError(error); });
    };
    ConfirmationSummaryComponent.prototype.submitToEmployerOnSuccess = function (response) {
        this._sessionService.setSummaryPageError("");
        this._sessionService.setShowSummaryPageError(false);
        this._routerExtensions.navigate(["/injuryreport/thankyou"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    ConfirmationSummaryComponent.prototype.submitToEmployerOnError = function (response) {
        this._sessionService.console("show error messages...");
        var errorMessage = "";
        this.showErrorMessage = true;
        for (var i = 0; i < response.returnMessage.length; i++) {
            errorMessage = errorMessage + response.returnMessage[i] + "\n";
            this._sessionService.console(response.returnMessage[i]);
        }
        dialogs.alert({
            title: "Submission Invalid.",
            message: errorMessage,
            okButtonText: "OK"
        }).then(function () {
        });
    };
    ConfirmationSummaryComponent.prototype.back = function () {
        this._routerExtensions.navigate(["/injuryreport/additionalquestions"], {
            clearHistory: true,
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
    ], ConfirmationSummaryComponent.prototype, "listView", void 0);
    ConfirmationSummaryComponent = __decorate([
        core_1.Component({
            selector: "confirmation-summary",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/confirmation-summary.component.html",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.RouterExtensions, injuryreport_service_1.InjuryReportService, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], ConfirmationSummaryComponent);
    return ConfirmationSummaryComponent;
}());
exports.ConfirmationSummaryComponent = ConfirmationSummaryComponent;
//# sourceMappingURL=confirmation-summary.component.js.map