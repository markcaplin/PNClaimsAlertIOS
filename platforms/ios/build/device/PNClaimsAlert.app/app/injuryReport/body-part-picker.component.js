"use strict";
var core_1 = require("@angular/core");
var injuryreport_model_1 = require("../models/injuryreport.model");
var injuryreport_service_1 = require("../services/injuryreport.service");
var user_service_1 = require("../services/user.service");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var bodyPart_model_1 = require("../models/bodyPart.model");
var router_1 = require('nativescript-angular/router');
var platform_1 = require("platform");
var dialogs = require("ui/dialogs");
var BodyPartPickerComponent = (function () {
    function BodyPartPickerComponent(_sessionService, _userService, _injuryReportService, _routerExtensions, _settingsService, _helperService) {
        this._sessionService = _sessionService;
        this._userService = _userService;
        this._injuryReportService = _injuryReportService;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._helperService = _helperService;
        this.frontImageHeight = [56, 45, 33, 22, 11];
        this.frontImageWidth = [48, 39, 29, 19, 9];
        this.backImageHeight = [65, 52, 26, 13, 6];
        this.backImageWidth = [50, 40, 20, 10, 5];
        this.frontImageHeightBase = 45;
        this.frontImageWidthBase = 39;
        this.backImageHeightBase = 52;
        this.backImageWidthBase = 40;
        this.fullResolution = 1;
        this.bodyParts = [];
        this.frontBodyParts = [];
        this.backBodyParts = [];
        this.addedBodyParts = [];
        this.removedBodyParts = [];
        this.originalBodyParts = [];
        this.isReadOnly = false;
        this.showEditButton = false;
        this.showTakeOwnershipButton = false;
        this.takingOwnership = false;
        this.Boolean = false;
        this.currentPinch = 1;
        this.pinchCount = 0;
        this.pinchInterval = 20;
        this.currentScale = 0;
        this.activeScale = 0;
        this.pinches = [];
        this.publicStartPinch = false;
        this.publicScale = 0;
        this.isBusy = false;
        this.isDirty = false;
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 165;
        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();
        this.injuryReport = _sessionService.getInjuryReport();
        this.bodyParts = this.injuryReport.bodyParts;
        this.bodyPartsLoaded = this._sessionService.getBodyPartsLoaded();
        this.bodyPartsLoadedForIncident = this._sessionService.getBodyPartsLoadedForIncident();
        this.showFrontBody = true;
        this.showBackBody = false;
        this.injuredAreas = "";
        _sessionService.console("body parts loaded init = " + this.bodyPartsLoaded);
        for (var i = 0; i < this.bodyParts.length; i++) {
            this.injuredAreas = this.injuredAreas + " " + this.bodyParts[i].htmlTitle + " ";
        }
    }
    BodyPartPickerComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.heightDIP = platform_1.screen.mainScreen.heightDIPs;
        this.heightPixels = platform_1.screen.mainScreen.heightPixels;
        this.widthDIP = platform_1.screen.mainScreen.widthDIPs;
        this.widthPixels = platform_1.screen.mainScreen.widthPixels;
        this.currentResolution = this.fullResolution;
        this.frontHeight = this.frontImageHeight[this.currentResolution];
        this.frontWidth = this.frontImageWidth[this.currentResolution];
        this.backHeight = this.backImageHeight[this.currentResolution];
        this.backWidth = this.backImageWidth[this.currentResolution];
        this._sessionService.console("body parts loaded = " + this.bodyPartsLoaded);
        if (this.bodyPartsLoaded == false) {
            this._injuryReportService.getBodyPartsForFront()
                .subscribe(function (bodyParts) { return _this.getBodyPartsFrontOnSuccess(bodyParts); }, function (error) { return _this.getBodyPartsFrontOnError(error); });
        }
        else {
            this.backBodyParts = this._sessionService.getBackBodyParts();
            this.frontBodyParts = this._sessionService.getFrontBodyParts();
            if (this.bodyPartsLoadedForIncident == false) {
                this._injuryReportService.getBodyPartsForInjuryReport(this.injuryReport)
                    .subscribe(function (bodyParts) { return _this.getBodyPartsForInjuryReportOnSuccess(bodyParts); }, function (error) { return _this.getBodyPartsForInjuryReportOnError(error); });
            }
            else {
                setTimeout(function () {
                    _this.isBusy = false;
                }, 500);
            }
        }
    };
    BodyPartPickerComponent.prototype.getBodyPartsFrontOnSuccess = function (bodyParts) {
        var _this = this;
        this.frontBodyParts = bodyParts;
        this._sessionService.setFrontBodyParts(bodyParts);
        this._sessionService.console("front body parts = " + this.frontBodyParts.length);
        this._injuryReportService.getBodyPartsForBack()
            .subscribe(function (bodyParts) { return _this.getBodyPartsBackOnSuccess(bodyParts); }, function (error) { return _this.getBodyPartsBackOnError(error); });
    };
    BodyPartPickerComponent.prototype.getBodyPartsFrontOnError = function (error) {
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
    BodyPartPickerComponent.prototype.getBodyPartsBackOnSuccess = function (bodyParts) {
        var _this = this;
        this.backBodyParts = bodyParts;
        this._sessionService.setBackBodyParts(bodyParts);
        this._sessionService.console("back body parts = " + this.backBodyParts.length);
        this._injuryReportService.getBodyPartsForInjuryReport(this.injuryReport)
            .subscribe(function (bodyParts) { return _this.getBodyPartsForInjuryReportOnSuccess(bodyParts); }, function (error) { return _this.getBodyPartsForInjuryReportOnError(error); });
    };
    BodyPartPickerComponent.prototype.getBodyPartsForInjuryReportOnSuccess = function (bodyParts) {
        // When the component first loads we need to let the summary component know if there are saved body parts or not
        var _this = this;
        this.injuryReport.bodyParts = bodyParts;
        this.originalBodyParts = bodyParts;
        this.injuredAreas = "";
        for (var i = 0; i < this.bodyParts.length; i++) {
            this.injuredAreas = this.injuredAreas + " " + this.bodyParts[i].htmlTitle + " ";
        }
        this._sessionService.setBodyPartsLoaded(true);
        this.bodyPartsLoaded = true;
        this.bodyPartsLoadedForIncident = true;
        this._sessionService.setBodyPartsLoadedForIncident(true);
        setTimeout(function () {
            _this.isBusy = false;
        }, 500);
    };
    BodyPartPickerComponent.prototype.getBodyPartsForInjuryReportOnError = function (error) {
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
    BodyPartPickerComponent.prototype.getBodyPartsBackOnError = function (error) {
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
    BodyPartPickerComponent.prototype.ngAfterViewInit = function () {
    };
    BodyPartPickerComponent.prototype.selectedMenuItem = function (e) {
        if (e.newIndex == 1) {
            this.showFrontBody = false;
            this.showBackBody = true;
        }
        else {
            this.showBackBody = false;
            this.showFrontBody = true;
        }
    };
    BodyPartPickerComponent.prototype.onPinch = function (args) {
        //this.pinchCount++;
        var scale = args.scale;
        //this.publicScale = scale;
        if (scale < 2.30) {
            this.frontHeight = this.frontImageHeightBase * scale;
            this.frontWidth = this.frontImageWidthBase * scale;
            this.backHeight = this.backImageHeightBase * scale;
            this.backWidth = this.backImageWidthBase * scale;
        }
        // if ("a"=="a") {
        //     return false;
        //}
        //let startPinch: Boolean = false;
        //if (this.pinchCount % this.pinchInterval === 0) {
        //    startPinch = true;
        //}
        //this.pinches.push(scale);
        //this.publicStartPinch = startPinch;
        //this.publicScale = scale;
        //if (startPinch == false) return;
        //if (scale<2.00) {
        //     
        //    this.frontHeight = this.frontImageHeightBase * scale;
        //    this.frontWidth = this.frontImageWidthBase * scale;
        //
        //    this.backHeight = this.backImageHeightBase * scale;
        //    this.backWidth = this.backImageWidthBase * scale;
        //      
        //}
        //if ("a"=="a") {
        //    return false;
        //}
        //let pinches = this.pinches.length;
        //let highEnd = pinches - 1;
        //let lowEnd = highEnd - this.pinchInterval + 1;
        //let lowRange: number = this.pinches[lowEnd];
        //let highRange: number = this.pinches[highEnd];
        //this.publicScale = lowRange;
        //let increasing: Boolean = false;
        //if (highRange > lowRange) {
        //    increasing = true;         
        //}            
        //if (scale > this.currentPinch && increasing==true) {
        //     
        //     this.currentPinch = scale;
        //     
        //     if(scale>1.00 && scale<2.00) {
        //         this.frontHeight = this.frontHeight * scale;
        ///         this.frontWidth = this.frontWidth * scale;
        //          this.backHeight = this.backHeight * scale;
        //          this.backWidth = this.backWidth * scale;
        //      }
        //
        // }
        //  else if (scale < this.currentPinch && increasing==false) {
        //    
        //      this.currentPinch = scale;
        //      
        //      if (scale<1.00) {   
        //          this.frontHeight = this.frontHeight * scale;
        //          this.frontWidth = this.frontWidth * scale;
        //          this.backHeight = this.backHeight * scale;
        //          this.backWidth = this.backWidth * scale;
        //      }
        //
        //  }
        //this.pinchCount = 0;
    };
    BodyPartPickerComponent.prototype.frontImagePressed = function (args, imageID) {
        var _this = this;
        if (this.longPressInProgress == true) {
            return false;
        }
        if (this.isReadOnly == true) {
            return false;
        }
        this.longPressInProgress = true;
        var toggleDelete = false;
        if (imageID == "") {
            setTimeout(function () {
                _this.longPressInProgress = false;
            }, 2000);
            return;
        }
        this._sessionService.console(imageID + " selected");
        for (var i = 0; i < this.bodyParts.length; i++) {
            if (this.bodyParts[i].name == imageID && this.bodyParts[i].location == 1) {
                this.bodyParts.splice(i, 1);
                toggleDelete = true;
                break;
            }
        }
        if (toggleDelete == true) {
            this.injuredAreas = "";
            for (var i = 0; i < this.bodyParts.length; i++) {
                this.injuredAreas = this.injuredAreas + " " + this.bodyParts[i].htmlTitle + " ";
            }
            setTimeout(function () {
                _this.longPressInProgress = false;
            }, 2000);
            this.isDirty = true;
            return;
        }
        var bodyPart = new bodyPart_model_1.BodyPart();
        bodyPart.location = 1;
        bodyPart.name = imageID;
        bodyPart.htmlTitle = imageID;
        for (i = 0; i < this.frontBodyParts.length; i++) {
            if (imageID == this.frontBodyParts[i].name) {
                bodyPart.bodyPartID = this.frontBodyParts[i].bodyPartID;
                bodyPart.bodyPartIDStr = this.frontBodyParts[i].bodyPartIDStr;
            }
        }
        this.bodyParts.push(bodyPart);
        this.injuredAreas = this.injuredAreas + " " + bodyPart.htmlTitle + " ";
        this.isDirty = true;
        setTimeout(function () {
            _this.longPressInProgress = false;
        }, 1000);
    };
    BodyPartPickerComponent.prototype.backImagePressed = function (args, imageID) {
        var _this = this;
        if (this.longPressInProgress == true) {
            return false;
        }
        if (this.isReadOnly == true) {
            return false;
        }
        this.longPressInProgress = true;
        var toggleDelete = false;
        if (imageID == "") {
            setTimeout(function () {
                _this.longPressInProgress = false;
            }, 2000);
            return;
        }
        for (var i = 0; i < this.bodyParts.length; i++) {
            if (this.bodyParts[i].name == imageID && this.bodyParts[i].location == 2) {
                this.bodyParts.splice(i, 1);
                toggleDelete = true;
                break;
            }
        }
        if (toggleDelete == true) {
            this.injuredAreas = "";
            for (var i = 0; i < this.bodyParts.length; i++) {
                this.injuredAreas = this.injuredAreas + " " + this.bodyParts[i].htmlTitle + " ";
            }
            setTimeout(function () {
                _this.longPressInProgress = false;
            }, 2000);
            this.isDirty = true;
            return;
        }
        this._sessionService.console(imageID + " selected");
        var bodyPart = new bodyPart_model_1.BodyPart();
        bodyPart.location = 2;
        bodyPart.name = imageID;
        bodyPart.htmlTitle = imageID;
        for (i = 0; i < this.backBodyParts.length; i++) {
            if (imageID == this.backBodyParts[i].name) {
                bodyPart.bodyPartID = this.backBodyParts[i].bodyPartID;
                bodyPart.bodyPartIDStr = this.backBodyParts[i].bodyPartIDStr;
            }
        }
        if (imageID != "Back") {
            imageID = "Back of " + imageID;
            bodyPart.htmlTitle = imageID;
        }
        this.bodyParts.push(bodyPart);
        this.injuredAreas = this.injuredAreas + " " + bodyPart.htmlTitle + " ";
        this.isDirty = true;
        setTimeout(function () {
            _this.longPressInProgress = false;
        }, 1000);
    };
    BodyPartPickerComponent.prototype.increaseZoom = function () {
        this._sessionService.console("increase=" + this.currentResolution);
        if (this.currentResolution == 0) {
            return;
        }
        this.currentResolution = this.currentResolution - 1;
        this.frontHeight = this.frontImageHeight[this.currentResolution];
        this.frontWidth = this.frontImageWidth[this.currentResolution];
        this.backHeight = this.backImageHeight[this.currentResolution];
        this.backWidth = this.backImageWidth[this.currentResolution];
    };
    BodyPartPickerComponent.prototype.decreaseZoom = function () {
        this._sessionService.console("decrease=" + this.currentResolution);
        if (this.currentResolution == 4) {
            return;
        }
        this.currentResolution = this.currentResolution + 1;
        this.frontHeight = this.frontImageHeight[this.currentResolution];
        this.frontWidth = this.frontImageWidth[this.currentResolution];
        this.backHeight = this.backImageHeight[this.currentResolution];
        this.backWidth = this.backImageWidth[this.currentResolution];
    };
    BodyPartPickerComponent.prototype.edit = function () {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    };
    BodyPartPickerComponent.prototype.home = function () {
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
    BodyPartPickerComponent.prototype.save = function () {
        var _this = this;
        this._sessionService.console("is dirty " + this.isDirty);
        if (this.isDirty == false) {
            if (this.buttonPressed == "back") {
                this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
            }
            else if (this.buttonPressed == "forward") {
                this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionSlideRight,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
            }
            return;
        }
        this._sessionService.console("save start");
        this.isBusy = true;
        this.injuryReport.bodyParts = this.bodyParts;
        this._sessionService.setInjuryReport(this.injuryReport);
        this._sessionService.console("body parts = " + this.bodyParts.length);
        this.addedBodyParts = new Array();
        this.removedBodyParts = new Array();
        for (var i = 0; i < this.bodyParts.length; i++) {
            var existingBodyPart = false;
            for (var x = 0; x < this.originalBodyParts.length; x++) {
                this._sessionService.console(this.bodyParts[i].name + " " + this.originalBodyParts[x].name);
                if (this.bodyParts[i].name == this.originalBodyParts[x].name) {
                    existingBodyPart = true;
                    break;
                }
            }
            if (existingBodyPart == false) {
                this.addedBodyParts.push(this.bodyParts[i]);
            }
        }
        this._sessionService.console("original body parts = " + this.originalBodyParts.length);
        for (var i = 0; i < this.originalBodyParts.length; i++) {
            var deletedBodyPart = true;
            for (var x = 0; x < this.bodyParts.length; x++) {
                this._sessionService.console("find removed =" + this.bodyParts[x].name + " " + this.originalBodyParts[i].name);
                if (this.bodyParts[x].name == this.originalBodyParts[i].name) {
                    deletedBodyPart = false;
                    break;
                }
            }
            if (deletedBodyPart == true) {
                this._sessionService.console("added to removed body parts list = " + this.originalBodyParts[i].name);
                this.removedBodyParts.push(this.originalBodyParts[i]);
            }
        }
        this._sessionService.console("post body parts added = " + this.addedBodyParts.length);
        this._sessionService.console("post body parts removed = " + this.removedBodyParts.length);
        var bodyPartsInformation = new bodyPart_model_1.BodyPart();
        bodyPartsInformation.injuryReportIDStr = this.injuryReport.injuryReportIDStr;
        bodyPartsInformation.addedBodyParts = this.addedBodyParts;
        bodyPartsInformation.removedBodyParts = this.removedBodyParts;
        this._sessionService.console("ID = " + bodyPartsInformation.injuryReportIDStr);
        this._injuryReportService.saveInjuryReportBodyParts(bodyPartsInformation)
            .subscribe(function (response) { return _this.saveInjuryReportBodyPartsOnSuccess(response); }, function (error) { return _this.saveInjuryReportBodyPartsOnError(error); });
    };
    BodyPartPickerComponent.prototype.saveInjuryReportBodyPartsOnSuccess = function (response) {
        this._sessionService.console("save");
        if (this.buttonPressed == "back") {
            this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionName,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }
        else if (this.buttonPressed == "forward") {
            this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }
        this.buttonPressed = "";
        this.isDirty = false;
        dialogs.alert({
            title: "Saved",
            message: "Information successfully saved.",
            okButtonText: "OK"
        }).then(function () {
        });
    };
    BodyPartPickerComponent.prototype.saveInjuryReportBodyPartsOnError = function (response) {
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
    BodyPartPickerComponent.prototype.back = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
            if (_this.isReadOnly == true) {
                _this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
                    clearHistory: true,
                    transition: {
                        name: _this._settingsService.transitionName,
                        duration: _this._settingsService.transitionDuration,
                        curve: _this._settingsService.transitionCurve
                    }
                });
                return;
            }
            _this.buttonPressed = "back";
            _this.save();
        }, 100);
    };
    BodyPartPickerComponent.prototype.forward = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
            if (_this.isReadOnly == true) {
                _this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                    clearHistory: true,
                    transition: {
                        name: _this._settingsService.transitionSlideRight,
                        duration: _this._settingsService.transitionDuration,
                        curve: _this._settingsService.transitionCurve
                    }
                });
                return;
            }
            _this.buttonPressed = "forward";
            _this.save();
        }, 100);
    };
    BodyPartPickerComponent.prototype.unlock = function () {
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
    BodyPartPickerComponent.prototype.lockInjuryReportOnSuccess = function (injuryReport) {
        this.showEditButton = true;
        this.showTakeOwnershipButton = false;
        this._sessionService.setShowEditButton(true);
        this._sessionService.setTakeOwnershipButton(false);
        this.isBusy = false;
    };
    BodyPartPickerComponent.prototype.lockInjuryReportOnError = function (response) {
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
    ], BodyPartPickerComponent.prototype, "listView", void 0);
    BodyPartPickerComponent = __decorate([
        core_1.Component({
            selector: "body-part-picker",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/body-part-picker.component.html",
            providers: [],
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, user_service_1.UserService, injuryreport_service_1.InjuryReportService, router_1.RouterExtensions, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], BodyPartPickerComponent);
    return BodyPartPickerComponent;
}());
exports.BodyPartPickerComponent = BodyPartPickerComponent;
//# sourceMappingURL=body-part-picker.component.js.map