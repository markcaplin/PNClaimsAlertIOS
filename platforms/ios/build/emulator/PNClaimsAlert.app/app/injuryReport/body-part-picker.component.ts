
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, ChangeDetectionStrategy } from "@angular/core";
import { User } from "../models/user.model";
import { InjuryReport } from "../models/injuryreport.model";

import { InjuryReportService } from "../services/injuryreport.service";
import { UserService } from "../services/user.service";
import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';

import { BodyPart } from "../models/bodyPart.model";

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';
import { ListView, ItemEventData } from "ui/list-view";

import { GestureEventData, GestureTypes, TouchGestureEventData, PinchGestureEventData } from "ui/gestures";
import { screen } from "platform";
import * as dialogs from "ui/dialogs";

@Component({
    selector: "body-part-picker",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/body-part-picker.component.html",
    providers: [],
    changeDetection: ChangeDetectionStrategy.OnPush

})

export class BodyPartPickerComponent implements OnInit, AfterViewInit {

    @ViewChild("listView") listView: ElementRef;

    private injuryReport: InjuryReport;

    public dateOfIncident: string;

    private frontImageHeight: Array<number> = [56, 45, 33, 22, 11];
    private frontImageWidth: Array<number> = [48, 39, 29, 19, 9];

    private backImageHeight: Array<number> = [65, 52, 26, 13, 6];
    private backImageWidth: Array<number> = [50, 40, 20, 10, 5];

    private frontImageHeightBase: number = 45;
    private frontImageWidthBase: number = 39;

    private backImageHeightBase: number = 52;
    private backImageWidthBase: number = 40;

    public showFrontBody: Boolean;
    public showBackBody: Boolean;

    public x: number;
    public y: number;

    public heightDIP: number;
    public heightPixels: number;
    public widthDIP: number;
    public widthPixels: number;
    public selected: string;

    public frontHeight: number;
    public frontWidth: number;

    public backHeight: number;
    public backWidth: number;

    private currentResolution: number;
    private fullResolution: number = 1;

    public bodyParts: Array<BodyPart> = [];

    public listViewControl: ListView;

    public message: string;
    public injuredAreas: string;

    public viewHeight: number;
    public height: number;

    private frontBodyParts: Array<BodyPart> = [];
    private backBodyParts: Array<BodyPart> = [];

    public addedBodyParts: Array<BodyPart> = [];
    public removedBodyParts: Array<BodyPart> = [];

    public originalBodyParts: Array<BodyPart> = [];

    public isBusy: Boolean;
    private buttonPressed: string;
    public returnMessage: string;
    private isDirty: Boolean;
    private bodyPartsLoaded: Boolean;
    private bodyPartsLoadedForIncident: Boolean;
    public isReadOnly: Boolean = false;
    public showEditButton: Boolean = false;
    public showTakeOwnershipButton: Boolean = false;
    public takingOwnership: Boolean = false;
    public longPressInProgress; Boolean = false;
    private currentPinch: number = 1;
    private pinchCount: number = 0;
    private pinchInterval: number = 20;
    private currentScale: number = 0;
    private activeScale: number = 0;
    private pinches: Array<number> = [];

    public publicStartPinch: Boolean = false;
    public publicScale: number = 0;

    public constructor(private _sessionService: SessionService, private _userService: UserService, private _injuryReportService: InjuryReportService,
        private _routerExtensions: RouterExtensions, private _settingsService: SettingsService, private _helperService: HelperService) {

        this.isBusy = false;
        this.isDirty = false;

        this.viewHeight = screen.mainScreen.heightDIPs;
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

    public ngOnInit() {

        this.heightDIP = screen.mainScreen.heightDIPs;
        this.heightPixels = screen.mainScreen.heightPixels;

        this.widthDIP = screen.mainScreen.widthDIPs;
        this.widthPixels = screen.mainScreen.widthPixels;

        this.currentResolution = this.fullResolution;

        this.frontHeight = this.frontImageHeight[this.currentResolution];
        this.frontWidth = this.frontImageWidth[this.currentResolution];

        this.backHeight = this.backImageHeight[this.currentResolution];
        this.backWidth = this.backImageWidth[this.currentResolution];

        this._sessionService.console("body parts loaded = " + this.bodyPartsLoaded);

        if (this.bodyPartsLoaded == false) {
            this._injuryReportService.getBodyPartsForFront()
                .subscribe(
                (bodyParts) => this.getBodyPartsFrontOnSuccess(bodyParts),
                (error) => this.getBodyPartsFrontOnError(error)
                );
        }
        else {
            this.backBodyParts = this._sessionService.getBackBodyParts();
            this.frontBodyParts = this._sessionService.getFrontBodyParts();
            if (this.bodyPartsLoadedForIncident == false) {
                this._injuryReportService.getBodyPartsForInjuryReport(this.injuryReport)
                    .subscribe(
                    (bodyParts) => this.getBodyPartsForInjuryReportOnSuccess(bodyParts),
                    (error) => this.getBodyPartsForInjuryReportOnError(error)
                    );
            }
            else {
                setTimeout(() => {
                    this.isBusy = false;
                }, 500);
            }
        }

    }

    private getBodyPartsFrontOnSuccess(bodyParts: Array<BodyPart>) {

        this.frontBodyParts = bodyParts;
        this._sessionService.setFrontBodyParts(bodyParts);
        this._sessionService.console("front body parts = " + this.frontBodyParts.length);
        this._injuryReportService.getBodyPartsForBack()
            .subscribe(
            (bodyParts) => this.getBodyPartsBackOnSuccess(bodyParts),
            (error) => this.getBodyPartsBackOnError(error)
            );

    }

    private getBodyPartsFrontOnError(error: any) {
   
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


    private getBodyPartsBackOnSuccess(bodyParts: Array<BodyPart>) {

        this.backBodyParts = bodyParts;
        this._sessionService.setBackBodyParts(bodyParts);
        this._sessionService.console("back body parts = " + this.backBodyParts.length);

        this._injuryReportService.getBodyPartsForInjuryReport(this.injuryReport)
            .subscribe(
            (bodyParts) => this.getBodyPartsForInjuryReportOnSuccess(bodyParts),
            (error) => this.getBodyPartsForInjuryReportOnError(error)
            );
    }

    private getBodyPartsForInjuryReportOnSuccess(bodyParts: Array<BodyPart>) {

        // When the component first loads we need to let the summary component know if there are saved body parts or not

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

        setTimeout(() => {
            this.isBusy = false;
        }, 500);

    }

    private getBodyPartsForInjuryReportOnError(error: TransactionalInformation) {

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


    private getBodyPartsBackOnError(error: any) {
  
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


    public ngAfterViewInit(): void {

    }

    public selectedMenuItem(e: any) {
        if (e.newIndex == 1) {
            this.showFrontBody = false;
            this.showBackBody = true;
        }
        else {
            this.showBackBody = false;
            this.showFrontBody = true;
        }
    }

    public onPinch(args: PinchGestureEventData) {  

        //this.pinchCount++;

        let scale: number = args.scale;
        
        //this.publicScale = scale;

        if (scale<2.30) {

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

    }

    public frontImagePressed(args: GestureEventData, imageID) {

        if (this.longPressInProgress == true) {
            return false;
        }

        if (this.isReadOnly == true) {
            return false;
        }

        this.longPressInProgress = true;

        let toggleDelete: Boolean = false;

        if (imageID == "") {
            setTimeout(() => {
                this.longPressInProgress = false;
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
            setTimeout(() => {
                this.longPressInProgress = false;
            }, 2000);
            this.isDirty = true;
            return;
        }

        let bodyPart = new BodyPart();
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

        setTimeout(() => {
            this.longPressInProgress = false;
        }, 1000);

    }

    public backImagePressed(args: GestureEventData, imageID) {

        if (this.longPressInProgress == true) {
            return false;
        }

        if (this.isReadOnly == true) {
            return false;
        }

        this.longPressInProgress = true;

        let toggleDelete: Boolean = false;

        if (imageID == "") {
            setTimeout(() => {
                this.longPressInProgress = false;
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

            setTimeout(() => {
                this.longPressInProgress = false;
            }, 2000);

            this.isDirty = true;

            return;
        }

        this._sessionService.console(imageID + " selected");

        let bodyPart = new BodyPart();
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

        setTimeout(() => {
            this.longPressInProgress = false;
        }, 1000);

    }

    public increaseZoom() {

        this._sessionService.console("increase=" + this.currentResolution);

        if (this.currentResolution == 0) {
            return;
        }

        this.currentResolution = this.currentResolution - 1;

        this.frontHeight = this.frontImageHeight[this.currentResolution];
        this.frontWidth = this.frontImageWidth[this.currentResolution];

        this.backHeight = this.backImageHeight[this.currentResolution];
        this.backWidth = this.backImageWidth[this.currentResolution];

    }

    public decreaseZoom() {

        this._sessionService.console("decrease=" + this.currentResolution);

        if (this.currentResolution == 4) {
            return;
        }

        this.currentResolution = this.currentResolution + 1;

        this.frontHeight = this.frontImageHeight[this.currentResolution];
        this.frontWidth = this.frontImageWidth[this.currentResolution];

        this.backHeight = this.backImageHeight[this.currentResolution];
        this.backWidth = this.backImageWidth[this.currentResolution];

    }

    private edit() {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
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

        this._sessionService.console("is dirty " + this.isDirty);

        if (this.isDirty == false) {

            if (this.buttonPressed == "back") {
                this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
                    clearHistory: false,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
            }
            else if (this.buttonPressed == "forward") {
                this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                    clearHistory: false,
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

        this.addedBodyParts = new Array<BodyPart>();
        this.removedBodyParts = new Array<BodyPart>();

        for (var i = 0; i < this.bodyParts.length; i++) {
            let existingBodyPart: Boolean = false;
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
            let deletedBodyPart: Boolean = true;
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

        let bodyPartsInformation: BodyPart = new BodyPart();
        bodyPartsInformation.injuryReportIDStr = this.injuryReport.injuryReportIDStr;
        bodyPartsInformation.addedBodyParts = this.addedBodyParts;
        bodyPartsInformation.removedBodyParts = this.removedBodyParts;

        this._sessionService.console("ID = " + bodyPartsInformation.injuryReportIDStr);

        this._injuryReportService.saveInjuryReportBodyParts(bodyPartsInformation)
            .subscribe(
            (response) => this.saveInjuryReportBodyPartsOnSuccess(response),
            (error) => this.saveInjuryReportBodyPartsOnError(error)
            );

    }

    private saveInjuryReportBodyPartsOnSuccess(response: BodyPart) {

        this._sessionService.console("save");

        if (this.buttonPressed == "back") {
            this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
                clearHistory: false,
                transition: {
                    name: this._settingsService.transitionName,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });

        }
        else if (this.buttonPressed == "forward") {
            this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                clearHistory: false,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
        }

        this.buttonPressed = "";

        this.isDirty = false;       

    }

    private saveInjuryReportBodyPartsOnError(response: TransactionalInformation) {

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

    public back() {

        this.isBusy = true;

        setTimeout(() => {

            if (this.isReadOnly == true) {
                this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
                    clearHistory: false,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });

                return;
            }

            this.buttonPressed = "back";
            this.save();
       
        }, 100);

    }

    public forward() {

        this.isBusy = true;

        setTimeout(() => {

            if (this.isReadOnly == true) {
                this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                    clearHistory: false,
                    transition: {
                        name: this._settingsService.transitionSlideRight,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });

                return;

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