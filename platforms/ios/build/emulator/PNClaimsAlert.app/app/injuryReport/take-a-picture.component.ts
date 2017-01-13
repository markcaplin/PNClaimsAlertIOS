import * as camera from "camera";
import * as imageModule from "ui/image";
import * as fs from "file-system";

import { Page } from "ui/page";

import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy, ElementRef, ViewChild, NgZone } from "@angular/core";
import { User } from "../models/user.model";
import { InjuryReport } from "../models/injuryreport.model";
import { UserService } from "../services/user.service";
import { InjuryReportService } from "../services/injuryreport.service";
import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';
import { BodyPart } from "../models/bodyPart.model";
import { Document } from "../models/document.model";
import { Photo } from "../models/photo.model";

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';

import { ListView, ItemEventData } from "ui/list-view";
import * as enums from "ui/enums";

import { screen } from "platform";

import * as application from "application";
import * as imageSource from "image-source";
import * as dialogs from "ui/dialogs";

@Component({
    selector: "take-a-picture",
    templateUrl: "injuryReport/take-a-picture.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class TakePictureComponent implements OnInit, AfterViewInit {

    private injuryReport: InjuryReport;
    private user: User;

    @ViewChild("listView") listView: ElementRef;

    public listViewControl: ListView;
    public photos: Array<Photo> = [];
    public originalPhotos: Array<Photo> = [];
    public photosToDelete: Array<Photo> = [];
    public viewHeight: number;
    public scrollHeight: number;
    public returnMessage;
    public currentPhotoUploaded: number;
    private buttonPressed: string;
    public isReadOnly: Boolean = false;
    public isBusy: Boolean = false;
    public showEditButton: Boolean = false;
    public showTakeOwnershipButton: Boolean = false;
    public takingOwnership: Boolean = false;
    public padding: Number;

    public constructor(private ngZone: NgZone, private page: Page, private _sessionService: SessionService,
        private _injuryReportService: InjuryReportService,
        private _userService: UserService, private _routerExtensions: RouterExtensions, private _settingsService: SettingsService,
        private _helperService: HelperService)
    {

        this.padding = _settingsService.getPadding();

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 200;
        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();

        this.photos = this._sessionService.getPhotos();
        this.originalPhotos = this._sessionService.getOriginalPhotos();

        this._sessionService.console("total original documents = " + this.originalPhotos.length);
        this._sessionService.console("total photos = " + this.photos.length);

    }

    public ngOnInit() { }

    public ngAfterViewInit(): void {

        this._sessionService.console("after view init");

        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;

        this.injuryReport = this._sessionService.getInjuryReport();

        let initialLoadOfPhotos = this._sessionService.getInitialLoadOfPhotos();
        if (initialLoadOfPhotos == true) {

            this._sessionService.setInitialLoadOfPhotos(false);

            let injuryReport: InjuryReport = new InjuryReport();
            injuryReport.injuryReportID = this.injuryReport.injuryReportID;
            injuryReport.includeFileContents = true;

            this._sessionService.console("get documents for " + injuryReport.injuryReportID);

            this._injuryReportService.getInjuryReportDocuments(injuryReport)
                .subscribe(
                (documents) => this.getInjuryReportDocumentsOnSuccess(documents),
                (error) => this.getInjuryReportDocumentsOnError(error)
                );

        }

    }

    public getInjuryReportDocumentsOnSuccess(documents: Document[]) {

        this._sessionService.console("success photos found " + documents.length);


        this._sessionService.console("total original documents 2 = " + this.originalPhotos.length);
        this._sessionService.console("total photos 2 = " + this.photos.length);

        let counter: number = 0;

        for (let doc of documents) {

            counter++;

            this._sessionService.console("count = " + counter);

            let photo: Photo = new Photo();
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

            let photo2: Photo = new Photo();

            photo2.documentIDStr = this.photos[i].documentIDStr;
            photo2.fileName = this.photos[i].fileName;
            photo2.image = this.photos[i].image;

            this.originalPhotos.push(photo2);

            this._sessionService.console("loaded = " + i);

        }

        this._sessionService.setOriginalPhotos(this.originalPhotos);
        this._sessionService.console("total original documents = " + this.originalPhotos.length);

    }

    public getInjuryReportDocumentsOnError(response: TransactionalInformation) {

        this.isBusy = true;

        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

    public onItemTap(args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        let index: number = args.index;
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

    }

    public takePicture() {

        this._sessionService.console("tap action");

        let productionMode: Boolean = this._sessionService.isProductionMode();

        if (productionMode == true) {            

            camera.takePicture({ width: 150, height: 150, saveToGallery: false, keepAspectRatio: true }).then(picture => {    

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

                this.capturePhoto(picture);

            });
        }
        else {
            imageSource.fromUrl("https://placehold.it/150x150")
                .then(res => {
                    this.capturePhoto(res);
                });
        }

    }

    private capturePhoto(capturePhoto: any) {
        
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

        let pictureDate: Date = new Date();

        let stringDate = pictureDate.getFullYear() + "-" + (pictureDate.getMonth() + 1) + "-" + pictureDate.getDate() + "-" +
            pictureDate.getHours() + pictureDate.getMinutes() + pictureDate.getSeconds() + pictureDate.getMilliseconds();

        this._sessionService.console(stringDate);

        let photo = new Photo();
        photo.fileName = "image_" + stringDate + ".jpg";
        
        photo.image = image;
        photo.documentIDStr = null;
        this.photos.push(photo);
    
        this.listViewControl.refresh();

    }

    public home() {

        this.isBusy = true;

        this._sessionService.setIsDirty(false);

        setTimeout(() => {
            this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }, 100);

    }

    public save(): void {

        this._sessionService.console("save started");

        this.currentPhotoUploaded = 0;

        this._sessionService.savePhotos(this.photos);

        this.injuryReport = this._sessionService.getInjuryReport();
        this.user = this._sessionService.getUser();

        this.uploadDocuments();

    }

    private uploadDocuments() {

        this._sessionService.console("document index = " + this.currentPhotoUploaded);

        let max = this.currentPhotoUploaded + 1;
        if (max > this.photos.length) {
            this.currentPhotoUploaded = 0;
            this._sessionService.console("start deleting documents");
            this.deleteDocuments();
            return;
        }

        let photo: Photo = this.photos[this.currentPhotoUploaded];

        this._sessionService.console("photo id = " + photo.documentIDStr);

        if (photo.documentIDStr == null) {

            let documentInformation: Document = new Document();

            documentInformation.injuryReportID = this.injuryReport.injuryReportID;
            documentInformation.fileName = photo.fileName;
            documentInformation.fileSize = 0;
            documentInformation.mimeType = "image/jpeg";
            documentInformation.uploadedBy = this.user.userID;

            documentInformation.fileContents = photo.image.imageSource.toBase64String("jpeg");

            this._sessionService.console("begin http");

            this._injuryReportService.uploadDocument(documentInformation)
                .subscribe(
                (response) => this.uploadDocumentOnSuccess(response),
                (error) => this.uploadDocumentOnError(error)
                );
        }
        else {
            this.currentPhotoUploaded = this.currentPhotoUploaded + 1;
            this.uploadDocuments();
        }

    }

    public uploadDocumentOnSuccess(response: Document) {

        this._sessionService.console("upload successful " + response.documentIDStr);
        this.photos[this.currentPhotoUploaded].documentIDStr = response.documentIDStr;

        this.currentPhotoUploaded = this.currentPhotoUploaded + 1;

        this.uploadDocuments();
    
    }

    private deleteDocuments() {

        this._sessionService.console("delete documents total " + this.originalPhotos.length);

        this.photosToDelete = new Array<Photo>();

        for (var i = 0; i < this.originalPhotos.length; i++) {
            this._sessionService.console("file=" + this.originalPhotos[i].fileName + " " + this.originalPhotos[i].documentIDStr);
            let deletedPhoto: Boolean = true;
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


    }

    private deleteDocument() {

        this._sessionService.console("delete document = " + this.currentPhotoUploaded);

        let max = this.currentPhotoUploaded + 1;
        if (max > this.photosToDelete.length) {

            this.originalPhotos = new Array<Photo>();

            for (var i = 0; i < this.photos.length; i++) {
                let photo: Photo = new Photo();
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

        let documentInformation: Document = new Document();
        documentInformation.documentIDStr = this.photosToDelete[this.currentPhotoUploaded].documentIDStr;

        this._injuryReportService.deleteDocument(documentInformation)
            .subscribe(
            (response) => this.removeDocumentOnSuccess(response),
            (error) => this.removeDocumentOnError(error)
            );


    }

    private removeDocumentOnSuccess(response: any) {
        this.currentPhotoUploaded = this.currentPhotoUploaded + 1;
        this.deleteDocument();
    }

    private removeDocumentOnError(response: TransactionalInformation) {

        this.isBusy = true;

        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

    public uploadDocumentOnError(response: TransactionalInformation) {

        this.isBusy = true;

        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

    public checkDocumentError() {

        this.isBusy = true;

        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

    private edit() {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    }

    public back() {

        this.isBusy = true;

        setTimeout(() => {

            if (this.isReadOnly == true) {

                this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });

                return false;

            }

            this.buttonPressed = "back";
            this.save();
       
        }, 100);

    }

    public forward() {

        this.isBusy = true;

        setTimeout(() => {

            if (this.isReadOnly == true) {

                this._routerExtensions.navigate(["/injuryreport/additionalquestions"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });

                return false;
            }

            this.buttonPressed = "forward";
            this.save();

        }, 100);

    }

    public unlock() {

        if (this.takingOwnership == true) return false;

        let lockedByUser = this._sessionService.getLockedByUser();

        dialogs.confirm({

            title: "Take Ownership",
            message: "This injury report is currently locked by " + lockedByUser + ". Do you wish to take ownership of this injury report?",
            okButtonText: "OK",
            cancelButtonText: "Cancel"

        }).then(result => {

            this._sessionService.console("Dialog result: " + result);

            if (result == true) {

                let injuryReport = new InjuryReport();             
                injuryReport.injuryReportIDStr = this.injuryReport.injuryReportIDStr;

                this.isBusy = true;
                this.takingOwnership = true;

                this._injuryReportService.lockInjuryReport(injuryReport)
                    .subscribe(
                    (request) => this.lockInjuryReportOnSuccess(request),
                    (error) => this.lockInjuryReportOnError(error)
                    );

            }
        });

    }

    private lockInjuryReportOnSuccess(injuryReport: InjuryReport) {
        this.showEditButton = true;
        this.showTakeOwnershipButton = false;
        this._sessionService.setShowEditButton(true);
        this._sessionService.setTakeOwnershipButton(false);
        this.isBusy = false;

    }

    private lockInjuryReportOnError(response: TransactionalInformation) {

        this.isBusy = true;

        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

}

