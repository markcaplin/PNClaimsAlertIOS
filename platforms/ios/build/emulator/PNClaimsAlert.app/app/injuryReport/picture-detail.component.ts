
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { Photo } from "../models/photo.model";
import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';

import * as dialogs from "ui/dialogs";

import { screen } from "platform";
import * as application from "application";

@Component({
    selector: "picture-detail",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/picture-detail.component.html",
    providers: []
})

export class PictureDetailComponent implements OnInit, AfterViewInit {

    public photo: Photo;

    private photos: Array<Photo>;
    private photoIndex: number;

    private viewWidth: number;

    public height: number;
    public width: number;
    public isReadOnly: Boolean = false;
    public isEditable: Boolean = false;
    private originalFileName: string;

    constructor(private _sessionService: SessionService, private _routerExtensions: RouterExtensions, private _settingsService: SettingsService, private _helperService: HelperService) {

        this.photoIndex = _sessionService.getPhotoIndex();
        this.photos = _sessionService.getPhotos();
        this.photo = this.photos[this.photoIndex];

        this.viewWidth = screen.mainScreen.widthDIPs;
        this.width = this.viewWidth - 130;
        this.height = this.viewWidth - 130;

        this.isReadOnly = this._sessionService.getReadOnly();
        if (this.isReadOnly == true) {
            this.isEditable = false;
        }
        else {
            this.isEditable = true;
        }

        this._sessionService.console("width=" + screen.mainScreen.widthPixels + " " + screen.mainScreen.widthDIPs);

        this.originalFileName = this.photos[this.photoIndex].fileName + "";

        this._sessionService.console(this.originalFileName + "*");
    }


    public ngOnInit() {

    }

    public ngAfterViewInit(): void {

    }

    public delete(): void {

        dialogs.confirm({
            title: "Delete Photo",
            message: "OK to delete photo?",
            okButtonText: "Delete",
            cancelButtonText: "Cancel"
        }).then(result => {
            this._sessionService.console("Dialog result: " + result);
            if (result == true) {
                this.photos.splice(this.photoIndex, 1);
                this._sessionService.savePhotos(this.photos);
                this.back();
            }
        });

    }

    public save(): void {

        this._sessionService.console("save = " + this.photo.fileName.length + " " + this.originalFileName);

        if (this.photo.fileName.length == 0) return;

        this._sessionService.console("photo compare=" + this.photoIndex + " " + this.originalFileName + " " + this.photo.fileName);

        if (this.originalFileName != this.photo.fileName) {
            this._sessionService.console("file name changed " + this.originalFileName + " " + this.photo.fileName);
            this.photo.documentIDStr = null;
        }

        this.photos[this.photoIndex] = this.photo;

        this._sessionService.console("photo ID = " + this.photo.documentIDStr);

        this._sessionService.savePhotos(this.photos);
        this.back();

    }

    public back() {

        this._routerExtensions.navigate(["/injuryreport/takepicture"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }



}