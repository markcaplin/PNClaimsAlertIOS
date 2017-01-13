"use strict";
var camera = require("camera");
var imageModule = require("ui/image");
var page_1 = require("ui/page");
var core_1 = require("@angular/core");
var injuryreport_model_1 = require("../models/injuryreport.model");
var user_service_1 = require("../services/user.service");
var injuryreport_service_1 = require("../services/injuryreport.service");
var session_service_1 = require("../services/session.service");
var helper_service_1 = require("../services/helper.service");
var settings_service_1 = require('../services/settings.service');
var document_model_1 = require("../models/document.model");
var photo_model_1 = require("../models/photo.model");
var router_1 = require('nativescript-angular/router');
var platform_1 = require("platform");
var imageSource = require("image-source");
var dialogs = require("ui/dialogs");
var TakePictureComponent = (function () {
    function TakePictureComponent(ngZone, page, _sessionService, _injuryReportService, _userService, _routerExtensions, _settingsService, _helperService) {
        this.ngZone = ngZone;
        this.page = page;
        this._sessionService = _sessionService;
        this._injuryReportService = _injuryReportService;
        this._userService = _userService;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._helperService = _helperService;
        this.photos = [];
        this.originalPhotos = [];
        this.photosToDelete = [];
        this.isReadOnly = false;
        this.isBusy = false;
        this.showEditButton = false;
        this.showTakeOwnershipButton = false;
        this.takingOwnership = false;
        this.padding = _settingsService.getPadding();
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 200;
        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();
        this.photos = this._sessionService.getPhotos();
        this.originalPhotos = this._sessionService.getOriginalPhotos();
        this._sessionService.console("total original documents = " + this.originalPhotos.length);
        this._sessionService.console("total photos = " + this.photos.length);
    }
    TakePictureComponent.prototype.ngOnInit = function () { };
    TakePictureComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        this._sessionService.console("after view init");
        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;
        this.injuryReport = this._sessionService.getInjuryReport();
        var initialLoadOfPhotos = this._sessionService.getInitialLoadOfPhotos();
        if (initialLoadOfPhotos == true) {
            this._sessionService.setInitialLoadOfPhotos(false);
            var injuryReport = new injuryreport_model_1.InjuryReport();
            injuryReport.injuryReportID = this.injuryReport.injuryReportID;
            injuryReport.includeFileContents = true;
            this._sessionService.console("get documents for " + injuryReport.injuryReportID);
            this._injuryReportService.getInjuryReportDocuments(injuryReport)
                .subscribe(function (documents) { return _this.getInjuryReportDocumentsOnSuccess(documents); }, function (error) { return _this.getInjuryReportDocumentsOnError(error); });
        }
    };
    TakePictureComponent.prototype.getInjuryReportDocumentsOnSuccess = function (documents) {
        this._sessionService.console("success photos found " + documents.length);
        this._sessionService.console("total original documents 2 = " + this.originalPhotos.length);
        this._sessionService.console("total photos 2 = " + this.photos.length);
        var counter = 0;
        for (var _i = 0, documents_1 = documents; _i < documents_1.length; _i++) {
            var doc = documents_1[_i];
            counter++;
            this._sessionService.console("count = " + counter);
            var photo = new photo_model_1.Photo();
            photo.documentIDStr = doc.documentIDStr;
            photo.fileName = doc.fileName;
            this._sessionService.console("file contents = " + doc.fileContents);
            var image = new imageModule.Image();
            image.imageSource = imageSource.fromBase64(doc.fileContents);
            photo.image = image;
            this.photos.push(photo);
            this._sessionService.console(photo.fileName);
            this._sessionService.console("total photos=" + this.photos.length);
        }
        this._sessionService.console("total photos=" + this.photos.length);
        this.listViewControl.refresh();
        for (var i = 0; i < this.photos.length; i++) {
            this._sessionService.console("count = " + i);
            var photo2 = new photo_model_1.Photo();
            photo2.documentIDStr = this.photos[i].documentIDStr;
            photo2.fileName = this.photos[i].fileName;
            photo2.image = this.photos[i].image;
            this.originalPhotos.push(photo2);
            this._sessionService.console("loaded = " + i);
        }
        this._sessionService.setOriginalPhotos(this.originalPhotos);
        this._sessionService.console("total original documents = " + this.originalPhotos.length);
    };
    TakePictureComponent.prototype.getInjuryReportDocumentsOnError = function (response) {
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
    TakePictureComponent.prototype.onItemTap = function (args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        var index = args.index;
        this._sessionService.setPhotoIndex(index);
        this._sessionService.savePhotos(this.photos);
        this._routerExtensions.navigate(["/injuryreport/picturedetail"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    TakePictureComponent.prototype.takePicture = function () {
        var _this = this;
        this._sessionService.console("tap action");
        var productionMode = this._sessionService.isProductionMode();
        if (productionMode == true) {
            camera.takePicture({ width: 150, height: 150, saveToGallery: false, keepAspectRatio: true }).then(function (picture) {
                //var documents = fs.knownFolders.documents();
                //var path = fs.path.join(documents.path, "test.mov");
                //var file = fs.File.fromPath(path);
                // Writing text to the file.
                //file.writeSync(picture);
                //var file2 = fs.File.fromPath(path);
                //let dateModified: Date = file2.lastModified;
                //dialogs.confirm({
                //       title: "Test",
                //       message: dateModified.toLocaleDateString(),
                //       okButtonText: "Test",
                //       cancelButtonText: "Cancel"
                //}).then(result => {
                //                                            
                //    
                //});
                //dialogs.confirm({
                //       title: "Pre Test 1",
                //       message: "Pre Test 1",
                //       okButtonText: "pre Test 1",
                //       cancelButtonText: "Cancel"
                //}).then(result => {
                //                                             
                //     
                // });
                _this.capturePhoto(picture);
            });
        }
        else {
            imageSource.fromUrl("https://placehold.it/150x150")
                .then(function (res) {
                _this.capturePhoto(res);
            });
        }
    };
    TakePictureComponent.prototype.capturePhoto = function (capturePhoto) {
        //dialogs.confirm({
        //                title: "Test 1",
        //                message: "Test 1",
        //                okButtonText: "Test 1",
        //                cancelButtonText: "Cancel"
        //         }).then(result => {
        //                                                     
        //             
        //         });
        var image = new imageModule.Image();
        image.imageSource = capturePhoto;
        var pictureDate = new Date();
        var stringDate = pictureDate.getFullYear() + "-" + (pictureDate.getMonth() + 1) + "-" + pictureDate.getDate() + "-" +
            pictureDate.getHours() + pictureDate.getMinutes() + pictureDate.getSeconds() + pictureDate.getMilliseconds();
        this._sessionService.console(stringDate);
        var photo = new photo_model_1.Photo();
        photo.fileName = "image_" + stringDate + ".jpg";
        photo.image = image;
        photo.documentIDStr = null;
        this.photos.push(photo);
        this.listViewControl.refresh();
    };
    TakePictureComponent.prototype.home = function () {
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
    TakePictureComponent.prototype.save = function () {
        this._sessionService.console("save started");
        this.currentPhotoUploaded = 0;
        this._sessionService.savePhotos(this.photos);
        this.injuryReport = this._sessionService.getInjuryReport();
        this.user = this._sessionService.getUser();
        this.uploadDocuments();
    };
    TakePictureComponent.prototype.uploadDocuments = function () {
        var _this = this;
        this._sessionService.console("document index = " + this.currentPhotoUploaded);
        var max = this.currentPhotoUploaded + 1;
        if (max > this.photos.length) {
            this.currentPhotoUploaded = 0;
            this._sessionService.console("start deleting documents");
            this.deleteDocuments();
            return;
        }
        var photo = this.photos[this.currentPhotoUploaded];
        this._sessionService.console("photo id = " + photo.documentIDStr);
        if (photo.documentIDStr == null) {
            var documentInformation = new document_model_1.Document();
            documentInformation.injuryReportID = this.injuryReport.injuryReportID;
            documentInformation.fileName = photo.fileName;
            documentInformation.fileSize = 0;
            documentInformation.mimeType = "image/jpeg";
            documentInformation.uploadedBy = this.user.userID;
            documentInformation.fileContents = photo.image.imageSource.toBase64String("jpeg");
            this._sessionService.console("begin http");
            this._injuryReportService.uploadDocument(documentInformation)
                .subscribe(function (response) { return _this.uploadDocumentOnSuccess(response); }, function (error) { return _this.uploadDocumentOnError(error); });
        }
        else {
            this.currentPhotoUploaded = this.currentPhotoUploaded + 1;
            this.uploadDocuments();
        }
    };
    TakePictureComponent.prototype.uploadDocumentOnSuccess = function (response) {
        this._sessionService.console("upload successful " + response.documentIDStr);
        this.photos[this.currentPhotoUploaded].documentIDStr = response.documentIDStr;
        this.currentPhotoUploaded = this.currentPhotoUploaded + 1;
        this.uploadDocuments();
    };
    TakePictureComponent.prototype.deleteDocuments = function () {
        this._sessionService.console("delete documents total " + this.originalPhotos.length);
        this.photosToDelete = new Array();
        for (var i = 0; i < this.originalPhotos.length; i++) {
            this._sessionService.console("file=" + this.originalPhotos[i].fileName + " " + this.originalPhotos[i].documentIDStr);
            var deletedPhoto = true;
            for (var x = 0; x < this.photos.length; x++) {
                if (this.originalPhotos[i].documentIDStr == this.photos[x].documentIDStr) {
                    this._sessionService.console("keep photo = " + this.photos[x].fileName);
                    deletedPhoto = false;
                    break;
                }
            }
            if (deletedPhoto == true) {
                this.photosToDelete.push(this.originalPhotos[i]);
                this._sessionService.console("delete this photo = " + this.originalPhotos[i]);
            }
        }
        this.currentPhotoUploaded = 0;
        this._sessionService.console("deleting");
        this.deleteDocument();
    };
    TakePictureComponent.prototype.deleteDocument = function () {
        var _this = this;
        this._sessionService.console("delete document = " + this.currentPhotoUploaded);
        var max = this.currentPhotoUploaded + 1;
        if (max > this.photosToDelete.length) {
            this.originalPhotos = new Array();
            for (var i = 0; i < this.photos.length; i++) {
                var photo = new photo_model_1.Photo();
                photo.documentIDStr = this.photos[i].documentIDStr;
                photo.fileName = this.photos[i].fileName;
                photo.image = this.photos[i].image;
                this.originalPhotos.push(photo);
            }
            if (this.buttonPressed == "back") {
                this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
                this._sessionService.setIsDirty(false);
                this._sessionService.console("back");
                return;
            }
            else if (this.buttonPressed == "forward") {
                this._routerExtensions.navigate(["/injuryreport/additionalquestions"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
                this._sessionService.setIsDirty(false);
                this._sessionService.console("forward");
                return;
            }
            this._sessionService.setIsDirty(false);
            this._sessionService.console("done");
            dialogs.alert({
                title: "Saved",
                message: "Information successfully saved.",
                okButtonText: "OK"
            }).then(function () {
            });
            return;
        }
        var documentInformation = new document_model_1.Document();
        documentInformation.documentIDStr = this.photosToDelete[this.currentPhotoUploaded].documentIDStr;
        this._injuryReportService.deleteDocument(documentInformation)
            .subscribe(function (response) { return _this.removeDocumentOnSuccess(response); }, function (error) { return _this.removeDocumentOnError(error); });
    };
    TakePictureComponent.prototype.removeDocumentOnSuccess = function (response) {
        this.currentPhotoUploaded = this.currentPhotoUploaded + 1;
        this.deleteDocument();
    };
    TakePictureComponent.prototype.removeDocumentOnError = function (response) {
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
    TakePictureComponent.prototype.uploadDocumentOnError = function (response) {
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
    TakePictureComponent.prototype.checkDocumentError = function () {
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
    TakePictureComponent.prototype.edit = function () {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    };
    TakePictureComponent.prototype.back = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
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
            _this.buttonPressed = "back";
            _this.save();
        }, 100);
    };
    TakePictureComponent.prototype.forward = function () {
        var _this = this;
        this.isBusy = true;
        setTimeout(function () {
            if (_this.isReadOnly == true) {
                _this._routerExtensions.navigate(["/injuryreport/additionalquestions"], {
                    clearHistory: true,
                    transition: {
                        name: _this._settingsService.transitionName,
                        duration: _this._settingsService.transitionDuration,
                        curve: _this._settingsService.transitionCurve
                    }
                });
                return false;
            }
            _this.buttonPressed = "forward";
            _this.save();
        }, 100);
    };
    TakePictureComponent.prototype.unlock = function () {
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
    TakePictureComponent.prototype.lockInjuryReportOnSuccess = function (injuryReport) {
        this.showEditButton = true;
        this.showTakeOwnershipButton = false;
        this._sessionService.setShowEditButton(true);
        this._sessionService.setTakeOwnershipButton(false);
        this.isBusy = false;
    };
    TakePictureComponent.prototype.lockInjuryReportOnError = function (response) {
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
    ], TakePictureComponent.prototype, "listView", void 0);
    TakePictureComponent = __decorate([
        core_1.Component({
            selector: "take-a-picture",
            templateUrl: "injuryReport/take-a-picture.component.html",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [core_1.NgZone, page_1.Page, session_service_1.SessionService, injuryreport_service_1.InjuryReportService, user_service_1.UserService, router_1.RouterExtensions, settings_service_1.SettingsService, helper_service_1.HelperService])
    ], TakePictureComponent);
    return TakePictureComponent;
}());
exports.TakePictureComponent = TakePictureComponent;
//# sourceMappingURL=take-a-picture.component.js.map