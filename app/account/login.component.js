"use strict";
var core_1 = require("@angular/core");
var router_1 = require('nativescript-angular/router');
var user_model_1 = require("../models/user.model");
var user_service_1 = require("../services/user.service");
var session_service_1 = require("../services/session.service");
var injuryreport_service_1 = require("../services/injuryreport.service");
var settings_service_1 = require('../services/settings.service');
var page_1 = require("ui/page");
var dialogs = require("ui/dialogs");
var LoginComponent = (function () {
    function LoginComponent(page, _sessionService, _userService, _injuryReportService, _routerExtensions, _settingsService) {
        this.page = page;
        this._sessionService = _sessionService;
        this._userService = _userService;
        this._injuryReportService = _injuryReportService;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this.transitionList = ["fade", "flip", "slide"];
        this.padding = this._settingsService.getPadding();
        this.emailAddress = "mcaplin@patnat.com";
        this.password = "test";
        this.messageBox = "";
        this.showErrorMessage = false;
        this.transitions = [];
        for (var i = 0; i < this.transitionList.length; i++) {
            this.transitions.push(this.transitionList[i]);
        }
        //application.on(application.orientationChangedEvent, this.setOrientation);
    }
    LoginComponent.prototype.focusPassword = function () {
        dialogs.alert({
            title: "focus password event.",
            message: "focus",
            okButtonText: "OK"
        }).then(function () {
        });
        this.passwordElement.nativeElement.focus();
    };
    LoginComponent.prototype.setOrientation = function (args) {
        this.padding = this._settingsService.getPadding();
    };
    LoginComponent.prototype.ngOnInit = function () {
        this.page.className = "coverImage";
    };
    LoginComponent.prototype.ngOnDestroy = function () {
        // application.off(application.orientationChangedEvent);
    };
    LoginComponent.prototype.selectedIndexChanged = function (picker) {
        var transition = this.transitions[picker.selectedIndex];
        this._settingsService.transitionName = transition;
        this._settingsService.transitionSlideRight = transition;
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        var user = new user_model_1.User();
        user.emailAddress = this.emailAddress;
        user.password = this.password;
        //alert(user.emailAddress + " " + user.password);
        this._userService.login(user)
            .subscribe(function (user) { return _this.loginOnSuccess(user); }, function (error) { return _this.loginOnError(error); });
    };
    LoginComponent.prototype.loginOnSuccess = function (user) {
        var _this = this;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userName = user.firstName + " " + user.lastName + " " + user.userID;
        //alert("loggedin as " + this.userName);
        this._sessionService.console("logged in as " + user.userID);
        this._sessionService.setUser(user);
        this._injuryReportService.getNumberOfInjuryReportsForUser(user)
            .subscribe(function (user) { return _this.getNumberOfInjuryReportsForUserOnSuccess(user); }, function (error) { return _this.getNumberOfInjuryReportsForUserOnError(error); });
    };
    LoginComponent.prototype.getNumberOfInjuryReportsForUserOnSuccess = function (response) {
        this._sessionService.console("number of injuryReports = " + response.numberOfReports);
        if (response.numberOfReports > 0) {
            this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionName,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }
        else {
            this._sessionService.setSelectedIncidentReportString(null);
            this._sessionService.setInjuredEmployee(null);
            this._sessionService.setInjuryReport(null);
            this._sessionService.setInjuryType(null);
            this._sessionService.setBodyPartsLoadedForIncident(false);
            this._sessionService.setInitialLoadOfPhotos(true);
            this._sessionService.setReadOnly(false);
            this._sessionService.setShowEditButton(false);
            this._sessionService.setTakeOwnershipButton(false);
            this._sessionService.setLockedByUser("");
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
        }
    };
    LoginComponent.prototype.getNumberOfInjuryReportsForUserOnError = function (error) {
        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    LoginComponent.prototype.loginOnError = function (error) {
        if (error != null && error.returnMessage != null) {
            this._sessionService.console("error " + error);
            var errorMessage = "";
            for (var i = 0; i < error.returnMessage.length; i++) {
                errorMessage = errorMessage + error.returnMessage[i] + "\n";
                this._sessionService.console(error.returnMessage[i]);
            }
            dialogs.alert({
                title: "Login invalid.",
                message: errorMessage,
                okButtonText: "OK"
            }).then(function () {
            });
        }
    };
    __decorate([
        core_1.ViewChild("password"), 
        __metadata('design:type', core_1.ElementRef)
    ], LoginComponent.prototype, "passwordElement", void 0);
    LoginComponent = __decorate([
        core_1.Component({
            selector: "login",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "account/login.component.html",
            providers: []
        }), 
        __metadata('design:paramtypes', [page_1.Page, session_service_1.SessionService, user_service_1.UserService, injuryreport_service_1.InjuryReportService, router_1.RouterExtensions, settings_service_1.SettingsService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map