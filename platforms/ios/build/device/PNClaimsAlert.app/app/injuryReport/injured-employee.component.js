"use strict";
var core_1 = require("@angular/core");
var user_model_1 = require("../models/user.model");
var injuryreport_model_1 = require("../models/injuryreport.model");
var user_service_1 = require("../services/user.service");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var injuryreport_service_1 = require("../services/injuryreport.service");
var router_1 = require('nativescript-angular/router');
var dialogs = require("ui/dialogs");
var InjuredEmployeeComponent = (function () {
    function InjuredEmployeeComponent(_sessionService, _userService, _routerExtensions, _settingsService, _helperService, _injuryReportService) {
        var _this = this;
        this._sessionService = _sessionService;
        this._userService = _userService;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._helperService = _helperService;
        this._injuryReportService = _injuryReportService;
        this.showErrorMessage = false;
        this.selectedInjuryReportIDStr = null;
        this.injuryReportID = 0;
        this.isBusy = false;
        this.isReadOnly = false;
        this.showEditButton = false;
        this.showTakeOwnershipButton = false;
        this.takingOwnership = false;
        this.datePickerHeight = 0;
        this.padding = this._settingsService.getPadding();
        this.datePickerHeight = 0;
        this.selectedInjuryReportIDStr = this._sessionService.getSelectedIncidentReportString();
        this.user = _sessionService.getUser();
        this._sessionService.console("dirty=" + this._sessionService.getIsDirty());
        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();
        this._sessionService.console("show edit button = " + this.showEditButton);
        if (this.selectedInjuryReportIDStr == null) {
            this.injuredEmployee = _sessionService.getInjuredEmployee();
            if (this.injuredEmployee == null) {
                var injuredEmployee = new user_model_1.User();
                injuredEmployee.firstName = this.user.firstName;
                injuredEmployee.lastName = this.user.lastName;
                injuredEmployee.dateOfBirth = this.user.dateOfBirth;
                injuredEmployee.userID = this.user.userID;
                this.injuredEmployee = injuredEmployee;
                this._sessionService.setInjuredEmployee(injuredEmployee);
                var currentDate = new Date();
                var injuryReport = new injuryreport_model_1.InjuryReport();
                injuryReport.dateOfIncident = currentDate;
                this.injuryReport = injuryReport;
                this.injuryReport.bodyParts = [];
                this.injuryReport.injuredEmployee = this.injuredEmployee;
                this.injuryReport.injuredEmployeeID = this.injuredEmployee.userID;
                this._sessionService.console("injured employee id = " + this.injuryReport.injuredEmployeeID);
                this._sessionService.setInjuryReport(injuryReport);
            }
            else {
                this.injuredEmployee = _sessionService.getInjuredEmployee();
                this.injuryReport = _sessionService.getInjuryReport();
            }
            this.setValues();
        }
        else {
            var injuryReport = new injuryreport_model_1.InjuryReport();
            injuryReport.injuryReportIDStr = this.selectedInjuryReportIDStr;
            this.injuryReportIDStr = this.selectedInjuryReportIDStr;
            this.selectedInjuryReportIDStr == null;
            this._sessionService.setSelectedIncidentReportString(null);
            this._injuryReportService.getInjuryReport(injuryReport)
                .subscribe(function (search) { return _this.getInjuryReportOnSuccess(search); }, function (error) { return _this.getInjuryReportOnError(error); });
        }
    }
    InjuredEmployeeComponent.prototype.ngAfterViewInit = function () {
        this.datePickerControl = this.datePicker.nativeElement;
        this.datePickerHeight = 0;
    };
    InjuredEmployeeComponent.prototype.edit = function () {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    };
    InjuredEmployeeComponent.prototype.setValues = function () {
        this.injuredEmployeeName = this.injuredEmployee.firstName + " " + this.injuredEmployee.lastName;
        this.dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);
        var dateOfBirth = this._helperService.convertJsonDateToJavaScriptDate(this.injuredEmployee.dateOfBirth);
        this.dateOfBirth = this._helperService.formatDate(dateOfBirth);
        this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);
        var dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);
        this._sessionService.console(dateOfIncident);
        var newDate = new Date(dateOfIncident);
        this._sessionService.console("javascript incident date = " + newDate);
        if (this.datePicker == undefined) {
            return;
        }
        this.datePickerControl.date = newDate;
        this.datePickerHeight = 0;
    };
    InjuredEmployeeComponent.prototype.getInjuryReportOnSuccess = function (injuryReport) {
        this.injuredEmployee = injuryReport.injuredEmployee;
        this.injuryReport = injuryReport;
        this.injuryReportID = injuryReport.injuryReportID;
        this.injuryReport.injuryReportIDStr = this.injuryReportIDStr;
        this._sessionService.console("ID==" + this.injuryReportIDStr);
        this._sessionService.setInjuredEmployee(this.injuredEmployee);
        this._sessionService.setInjuryReport(this.injuryReport);
        this.setValues();
    };
    InjuredEmployeeComponent.prototype.getInjuryReportOnError = function (response) {
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
    InjuredEmployeeComponent.prototype.home = function () {
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
    InjuredEmployeeComponent.prototype.back = function () {
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
    InjuredEmployeeComponent.prototype.toggleDatePicker = function () {
        if (this.datePickerHeight == 125) {
            this.datePickerHeight = 0;
        }
        else {
            this.datePickerHeight = 125;
            this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);
            var dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);
            this._sessionService.console(dateOfIncident);
            var newDate = new Date(dateOfIncident);
            this._sessionService.console("javascript incident date = " + newDate);
            this.datePickerControl.date = newDate;
        }
        // this._routerExtensions.navigate(["/injuryreport/datepicker"], {
        //     clearHistory: false,
        //     transition: {
        //         name: this._settingsService.transitionName,
        //         duration: this._settingsService.transitionDuration,
        //         curve: this._settingsService.transitionCurve
        //     }
        // });
    };
    InjuredEmployeeComponent.prototype.dateChanged = function (property, oldValue, newValue) {
        var _this = this;
        var currentDate = this.datePickerControl.date;
        setTimeout(function () {
            if (currentDate == _this.datePickerControl.date) {
                return;
            }
            var today = new Date();
            if (_this.datePickerControl.date > today) {
                var dateOfIncident = _this._helperService.formatDate(_this.datePickerControl.date);
                dialogs.alert({
                    title: "Invalid Incident Date.",
                    message: "Reported incident date of " + dateOfIncident + " cannot be in the future",
                    okButtonText: "OK"
                }).then(function () {
                });
                _this.datePickerControl.date = currentDate;
                return;
            }
            _this.injuryReport.dateOfIncident = _this.datePickerControl.date;
            _this._sessionService.setIsDirty(true);
            _this.dateOfIncident = _this._helperService.formatDate(_this.injuryReport.dateOfIncident);
        }, 100);
    };
    InjuredEmployeeComponent.prototype.forward = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
            _this._sessionService.console("forward dirty =" + _this._sessionService.getIsDirty());
            _this._sessionService.console("forward");
            _this.buttonPressed = "forward";
            _this.showErrorMessage = false;
            _this.injuryReport = _this._sessionService.getInjuryReport();
            if (_this.isReadOnly == true) {
                _this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                    clearHistory: true,
                    transition: {
                        name: _this._settingsService.transitionName,
                        duration: _this._settingsService.transitionDuration,
                        curve: _this._settingsService.transitionCurve
                    }
                });
                return false;
            }
            if (_this._sessionService.getIsDirty() == true || _this.injuryReportID == 0) {
                _this._injuryReportService.duplicateInjuryReport(_this.injuryReport)
                    .subscribe(function (injuryReport) { return _this.duplicateInjuryReportOnSuccess(injuryReport); }, function (error) { return _this.duplicateInjuryReportOnError(error); });
            }
            else {
                _this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                    clearHistory: true,
                    transition: {
                        name: _this._settingsService.transitionName,
                        duration: _this._settingsService.transitionDuration,
                        curve: _this._settingsService.transitionCurve
                    }
                });
            }
        }, 100);
    };
    InjuredEmployeeComponent.prototype.save = function () {
        var _this = this;
        this.isBusy = true;
        this.buttonPressed = "save";
        this._sessionService.console("save");
        this.showErrorMessage = false;
        this.injuryReport = this._sessionService.getInjuryReport();
        this._sessionService.console("injury report id = " + this.injuryReport.injuryReportID);
        this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);
        this._sessionService.console("injured employee = " + this.injuryReport.injuredEmployeeID);
        this._injuryReportService.duplicateInjuryReport(this.injuryReport)
            .subscribe(function (injuryReport) { return _this.duplicateInjuryReportOnSuccess(injuryReport); }, function (error) { return _this.duplicateInjuryReportOnError(error); });
    };
    InjuredEmployeeComponent.prototype.duplicateInjuryReportOnSuccess = function (response) {
        this._sessionService.console("duplicate Injury Report On Success");
        if (response.duplicateInjuryReport) {
            this.isBusy = false;
            this.messageBox = "An injury already exists for the same user and incident date";
            dialogs.alert({
                title: "Validation Error",
                message: this.messageBox,
                okButtonText: "OK"
            }).then(function () { });
        }
        else {
            this.continueWithSave();
        }
    };
    InjuredEmployeeComponent.prototype.duplicateInjuryReportOnError = function (response) {
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
    InjuredEmployeeComponent.prototype.continueWithSave = function () {
        var _this = this;
        this._sessionService.console("Continue with Save");
        this._injuryReportService.saveInjuredEmployee(this.injuryReport)
            .subscribe(function (search) { return _this.saveInjuredEmployeeOnSuccess(search); }, function (error) { return _this.saveInjuredEmployeeOnError(error); });
    };
    InjuredEmployeeComponent.prototype.saveInjuredEmployeeOnSuccess = function (response) {
        this._sessionService.setIsDirty(false);
        this.isBusy = false;
        if (this.buttonPressed == "back") {
            this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }
        else if (this.buttonPressed == "forward") {
            this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionName,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }
        else {
            if (this.injuryReport.injuryReportID == 0) {
                this.injuryReport.injuryReportID = response.injuryReportID;
                this.injuryReportID = response.injuryReportID;
                this.injuryReport.injuryReportIDStr = response.injuryReportIDStr;
                this._sessionService.setInjuryReport(this.injuryReport);
            }
            this.buttonPressed = "";
            this._sessionService.console("success=" + this.injuryReport.injuryReportID);
            dialogs.alert({
                title: "Saved.",
                message: "Information successfully saved",
                okButtonText: "OK"
            }).then(function () {
            });
        }
    };
    InjuredEmployeeComponent.prototype.saveInjuredEmployeeOnError = function (error) {
        this.messageBox = "";
        this.isBusy = false;
        if (error != null && error.returnMessage != null) {
            this._sessionService.console("error message returned");
            if (error != null && error.returnMessage.length > 0) {
                this.messageBox = error.returnMessage[0];
            }
        }
        dialogs.alert({
            title: "Validation Error",
            message: this.messageBox,
            okButtonText: "OK"
        }).then(function () { });
        this._sessionService.console("error " + this.messageBox);
    };
    InjuredEmployeeComponent.prototype.searchForEmployee = function () {
        this._routerExtensions.navigate(["/injuryreport/searchemployees"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    InjuredEmployeeComponent.prototype.unlock = function () {
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
                injuryReport.injuryReportIDStr = _this.injuryReportIDStr;
                _this.isBusy = true;
                _this.takingOwnership = true;
                _this._injuryReportService.lockInjuryReport(injuryReport)
                    .subscribe(function (request) { return _this.lockInjuryReportOnSuccess(request); }, function (error) { return _this.lockInjuryReportOnError(error); });
            }
        });
    };
    InjuredEmployeeComponent.prototype.lockInjuryReportOnSuccess = function (injuryReport) {
        this.showEditButton = true;
        this.showTakeOwnershipButton = false;
        this._sessionService.setShowEditButton(true);
        this._sessionService.setTakeOwnershipButton(false);
        this.isBusy = false;
    };
    InjuredEmployeeComponent.prototype.lockInjuryReportOnError = function (response) {
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
        core_1.ViewChild('dp'), 
        __metadata('design:type', core_1.ElementRef)
    ], InjuredEmployeeComponent.prototype, "datePicker", void 0);
    InjuredEmployeeComponent = __decorate([
        core_1.Component({
            selector: "injured-employee",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/injured-employee.component.html",
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, user_service_1.UserService, router_1.RouterExtensions, settings_service_1.SettingsService, helper_service_1.HelperService, injuryreport_service_1.InjuryReportService])
    ], InjuredEmployeeComponent);
    return InjuredEmployeeComponent;
}());
exports.InjuredEmployeeComponent = InjuredEmployeeComponent;
//# sourceMappingURL=injured-employee.component.js.map