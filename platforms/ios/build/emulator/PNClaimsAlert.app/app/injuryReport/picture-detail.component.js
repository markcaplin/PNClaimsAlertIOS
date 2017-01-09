"use strict";
var core_1 = require("@angular/core");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var router_1 = require('nativescript-angular/router');
var dialogs = require("ui/dialogs");
var platform_1 = require("platform");
var PictureDetailComponent = (function () {
    function PictureDetailComponent(_sessionService, _routerExtensions, _settingsService, _helperService) {
        this._sessionService = _sessionService;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._helperService = _helperService;
        this.isReadOnly = false;
        this.isEditable = false;
        this.photoIndex = _sessionService.getPhotoIndex();
        this.photos = _sessionService.getPhotos();
        this.photo = this.photos[this.photoIndex];
        this.viewWidth = platform_1.screen.mainScreen.widthDIPs;
        this.width = this.viewWidth - 130;
        this.height = this.viewWidth - 130;
        this.isReadOnly = this._sessionService.getReadOnly();
        if (this.isReadOnly == true) {
            this.isEditable = false;
        }
        else {
            this.isEditable = true;
        }
        this._sessionService.console("width=" + platform_1.screen.mainScreen.widthPixels + " " + platform_1.screen.mainScreen.widthDIPs);
        this.originalFileName = this.photos[this.photoIndex].fileName + "";
        this._sessionService.console(this.originalFileName + "*");
    }
    PictureDetailComponent.prototype.ngOnInit = function () {
    };
    PictureDetailComponent.prototype.ngAfterViewInit = function () {
    };
    PictureDetailComponent.prototype.delete = function () {
        var _this = this;
        dialogs.confirm({
            title: "Delete Photo",
            message: "OK to delete photo?",
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        }).then(function (result) {
            _this._sessionService.console("Dialog result: " + result);
            if (result == true) {
                _this.photos.splice(_this.photoIndex, 1);
                _this._sessionService.savePhotos(_this.photos);
                _this.back();
            }
        });
    };
    PictureDetailComponent.prototype.save = function () {
        this._sessionService.console("save = " + this.photo.fileName.length + " " + this.originalFileName);
        if (this.photo.fileName.length == 0)
            return;
        this._sessionService.console("photo compare=" + this.photoIndex + " " + this.originalFileName + " " + this.photo.fileName);
        if (this.originalFileName != this.photo.fileName) {
            this._sessionService.console("file name changed " + this.originalFileName + " " + this.photo.fileName);
            this.photo.documentIDStr = null;
        }
        this.photos[this.photoIndex] = this.photo;
        this._sessionService.console("photo ID = " + this.photo.documentIDStr);
        this._sessionService.savePhotos(this.photos);
        this.back();
    };
    PictureDetailComponent.prototype.back = function () {
        this._routerExtensions.navigate(["/injuryreport/takepicture"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    PictureDetailComponent = __decorate([
        core_1.Component({
            selector: "picture-detail",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            templateUrl: "injuryReport/picture-detail.component.html",
            providers: []
        }), 
        __metadata('design:paramtypes', [session_service_1.SessionService, router_1.RouterExtensions, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], PictureDetailComponent);
    return PictureDetailComponent;
}());
exports.PictureDetailComponent = PictureDetailComponent;
//# sourceMappingURL=picture-detail.component.js.map