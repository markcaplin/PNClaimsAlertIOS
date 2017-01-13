"use strict";
var core_1 = require("@angular/core");
var injuryreport_model_1 = require("../models/injuryreport.model");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var injuryreport_service_1 = require("../services/injuryreport.service");
var router_1 = require('nativescript-angular/router');
var platform_1 = require("platform");
var dialogs = require("ui/dialogs");
var AdditionalQuestionsComponent = (function () {
    function AdditionalQuestionsComponent(_sessionService, _routerExtensions, _injuryReportService, _settingsService, _helperService) {
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
        this.showErrorMessage = false;
        this.initialLoad = true;
        this.modelChangCount = 0;
        this.isReadOnly = false;
        this.isEditable = false;
        this.isBusy = false;
        this.showEditButton = false;
        this.takingOwnership = false;
        this.showTakeOwnershipButton = false;
        this.padding = _settingsService.getPadding();
        this._sessionService.console("Constructor start");
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 145;
        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();
        this.injuryReport = this._sessionService.getInjuryReport();
        this.injuryType = this._sessionService.getInjuryType();
        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            this._sessionService.console("type of illness recorded = " + this.injuryReport.typeOfInjuryOrIllness);
            this._sessionService.setInjuryReport(this.injuryReport);
        }
        this._sessionService.console("Constructor ending with update " + this.isReadOnly);
    }
    AdditionalQuestionsComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._sessionService.console("ngAfterViewInit");
        var injuryTypes = this._sessionService.getInjuryTypes();
        this._sessionService.console("injury types = " + injuryTypes.length);
        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            this._sessionService.console("type of illness recorded = " + this.injuryReport.typeOfInjuryOrIllness);
        }
        if (injuryTypes.length > 0) {
            this.setValues();
            return;
        }
        this._sessionService.console("get injury types");
        this._injuryReportService.getInjuryTypes()
            .subscribe(function (response) { return _this.getInjuryTypesOnSuccess(response); }, function (error) { return _this.getInjuryTypesOnError(error); });
    };
    AdditionalQuestionsComponent.prototype.setValues = function () {
        this._sessionService.console("set values called");
        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            this._sessionService.console("type of illness recorded = " + this.injuryReport.typeOfInjuryOrIllness);
            this._sessionService.setInjuryReport(this.injuryReport);
            this._sessionService.setInjuryType(null);
        }
        var injuryTypes = this._sessionService.getInjuryTypes();
        this.injuryReport = this._sessionService.getInjuryReport();
        this.showTypeOfInjury = false;
        //this._sessionService.console("type of illness = " + this.injuryType.injuryTypeDescription);
        this._sessionService.console("type of illness = " + this.injuryReport.typeOfInjuryOrIllness);
        this._sessionService.console("need medical attention " + this.injuryReport.needMedicalAttention);
        var isOtherType = true;
        for (var i = 0; i < injuryTypes.length; i++) {
            if (this.injuryReport.typeOfInjuryOrIllness == injuryTypes[i].injuryTypeDescription) {
                isOtherType = false;
                this._sessionService.setInjuryType(injuryTypes[i]);
                break;
            }
        }
        if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
            isOtherType = true;
        }
        if (this.injuryReport.typeOfInjuryOrIllness == null) {
            isOtherType = false;
        }
        if (isOtherType) {
            this._sessionService.console("Other illness");
            if (this.injuryReport.typeOfInjury == null) {
                this.injuryReport.typeOfInjury = this.injuryReport.typeOfInjuryOrIllness;
                this.injuryReport.typeOfInjuryOrIllness = "Other";
            }
            this.showTypeOfInjury = true;
            for (var i = 0; i < injuryTypes.length; i++) {
                if ("Other" == injuryTypes[i].injuryTypeDescription) {
                    this._sessionService.setInjuryType(injuryTypes[i]);
                    break;
                }
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
    };
    AdditionalQuestionsComponent.prototype.getInjuryTypesOnSuccess = function (injuryTypes) {
        this._sessionService.saveInjuryTypes(injuryTypes);
        this._sessionService.console("Done");
        this.injuryReport.needMedicalAttentionSelected = true;
        if (this.injuryReport.needMedicalAttention == null) {
            this.injuryReport.needMedicalAttentionSelected = false;
        }
        this.injuryReport.injuryAtWorkplaceSelected = true;
        if (this.injuryReport.injuryOccuredAtWorkplace == null) {
            this.injuryReport.injuryAtWorkplaceSelected = false;
        }
        this.injuryReport.canContinueWorkingSelected = true;
        if (this.injuryReport.canContinueWorking == null) {
            this.injuryReport.canContinueWorkingSelected = false;
        }
        this.setValues();
    };
    AdditionalQuestionsComponent.prototype.getInjuryTypesOnError = function (response) {
        //this.loadingData = false;
        // this.isBusy = false;
    };
    AdditionalQuestionsComponent.prototype.injuryOccurredAtWork = function (selectedValue) {
        this._sessionService.setIsDirty(true);
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
    AdditionalQuestionsComponent.prototype.medicalAttentionNeeded = function (selectedValue) {
        this._sessionService.setIsDirty(true);
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
    AdditionalQuestionsComponent.prototype.continueWorking = function (selectedValue) {
        this._sessionService.setIsDirty(true);
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
    AdditionalQuestionsComponent.prototype.onModelChange = function () {
        if (this.initialLoad == true)
            return false;
        this._sessionService.setIsDirty(true);
    };
    AdditionalQuestionsComponent.prototype.edit = function () {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    };
    AdditionalQuestionsComponent.prototype.home = function () {
        var _this = this;
        this.isBusy = true;
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
    AdditionalQuestionsComponent.prototype.save = function () {
        var _this = this;
        this._sessionService.console("is dirty =" + this._sessionService.getIsDirty());
        if (this._sessionService.getIsDirty() == false) {
            if (this.buttonPressed == "back") {
                this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionSlideRight,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
                return;
            }
            else if (this.buttonPressed == "forward") {
                this._routerExtensions.navigate(["/injuryreport/confirmationsummary"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionSlideRight,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
                return;
            }
        }
        this.showErrorMessage = false;
        this._sessionService.setInjuryReport(this.injuryReport);
        var injuryReport = new injuryreport_model_1.InjuryReport();
        injuryReport.injuryReportID = this.injuryReport.injuryReportID;
        injuryReport.injuryReportIDStr = this.injuryReport.injuryReportIDStr;
        injuryReport.injuryOccuredAtWorkplace = this.injuryReport.injuryOccuredAtWorkplace;
        injuryReport.needMedicalAttention = this.injuryReport.needMedicalAttention;
        injuryReport.canContinueWorking = this.injuryReport.canContinueWorking;
        injuryReport.explanationOfInjuryLocation = this.injuryReport.explanationOfInjuryLocation;
        injuryReport.injuredWorkerEmailAddress = this.injuryReport.injuredWorkerEmailAddress;
        injuryReport.injuredWorkerPhoneNumber = this.injuryReport.injuredWorkerPhoneNumber;
        injuryReport.whyCannotContinueWorking = this.injuryReport.whyCannotContinueWorking;
        injuryReport.treatmentDescription = this.injuryReport.treatmentDescription;
        injuryReport.howDidInjuryOrIllnessOccur = this.injuryReport.howDidInjuryOrIllnessOccur;
        injuryReport.typeOfInjuryOrIllness = this.injuryReport.typeOfInjuryOrIllness;
        if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
            injuryReport.typeOfInjuryOrIllness = this.injuryReport.typeOfInjury;
        }
        this._sessionService.console("type of illness = " + injuryReport.typeOfInjuryOrIllness);
        if (this.injuryReport.injuryOccuredAtWorkplace == true) {
            injuryReport.explanationOfInjuryLocation = null;
        }
        if (this.injuryReport.canContinueWorking == true) {
            injuryReport.whyCannotContinueWorking = null;
        }
        this._injuryReportService.saveInjuryInfo(injuryReport)
            .subscribe(function (response) { return _this.saveInjuryInfoOnSuccess(response); }, function (error) { return _this.saveInjuryInfoOnError(error); });
    };
    AdditionalQuestionsComponent.prototype.saveInjuryInfoOnSuccess = function (response) {
        this._sessionService.setIsDirty(false);
        if (this.buttonPressed == "back") {
            this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
            return;
        }
        else if (this.buttonPressed == "forward") {
            this._routerExtensions.navigate(["/injuryreport/confirmationsummary"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
            return;
        }
        this.buttonPressed = "";
        dialogs.alert({
            title: "Saved",
            message: "Information successfully saved.",
            okButtonText: "OK"
        }).then(function () {
        });
    };
    AdditionalQuestionsComponent.prototype.saveInjuryInfoOnError = function (response) {
        this.showErrorMessage = true;
        this.buttonPressed = "";
        this.errorMessage = "";
        for (var i = 0; i < response.returnMessage.length; i++) {
            this.errorMessage = this.errorMessage + response.returnMessage[i];
        }
        dialogs.alert({
            title: "Validation Error",
            message: this.errorMessage,
            okButtonText: "OK"
        }).then(function () {
        });
    };
    AdditionalQuestionsComponent.prototype.back = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
            _this.buttonPressed = "back";
            _this.save();
        }, 100);
    };
    AdditionalQuestionsComponent.prototype.forward = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
            _this.buttonPressed = "forward";
            _this.save();
        }, 100);
    };
    AdditionalQuestionsComponent.prototype.searchForInjuryTypes = function () {
        this._sessionService.setInjuryReport(this.injuryReport);
        this._routerExtensions.navigate(["/injuryreport/selectinjurytype"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    AdditionalQuestionsComponent.prototype.unlock = function () {
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
    AdditionalQuestionsComponent.prototype.lockInjuryReportOnSuccess = function (injuryReport) {
        this.showEditButton = true;
        this.showTakeOwnershipButton = false;
        this._sessionService.setShowEditButton(true);
        this._sessionService.setTakeOwnershipButton(false);
        this.isBusy = false;
    };
    AdditionalQuestionsComponent.prototype.lockInjuryReportOnError = function (response) {
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
    AdditionalQuestionsComponent = __decorate([
        core_1.Component({
            selector: "additional-questions",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/additional-questions.component.html",
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.RouterExtensions, injuryreport_service_1.InjuryReportService, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], AdditionalQuestionsComponent);
    return AdditionalQuestionsComponent;
}());
exports.AdditionalQuestionsComponent = AdditionalQuestionsComponent;
//# sourceMappingURL=additional-questions.component.js.map