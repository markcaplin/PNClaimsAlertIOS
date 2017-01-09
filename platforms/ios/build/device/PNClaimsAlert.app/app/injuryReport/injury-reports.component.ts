import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { InjuryReportService } from '../services/injuryreport.service';
import { SessionService } from '../services/session.service';
import { SettingsService } from '../services/settings.service';

import { InjuryReport } from '../models/injuryreport.model';
import { InjuryType } from '../models/injury-type.model';

import { TransactionalInformation } from '../models/transactionalinformation.model';
import { User } from '../models/user.model';
import { Photo } from '../models/photo.model';

import { Roles} from "../models/enumerations";

import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';
import { screen } from "platform";
import * as application from "application";

import { ListView, ItemEventData } from "ui/list-view";

@Component({
    templateUrl: 'injuryReport/injury-reports.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class InjuryReportsComponent implements OnInit, AfterViewInit {


    @ViewChild("listView") listView: ElementRef;

    public injuryReports: Array<InjuryReport> = [];
    public columns = [];

    public alerts: Array<string> = [];
    public messageBox: string;

    public delaySearch: Boolean;
    public runningSearch: Boolean;

    public viewHeight: number;
    public scrollHeight: number;

    public listViewControl: ListView;
    public loadingData: Boolean;
    public isBusy: Boolean;

    public selectedIndex: number;
    public user: User;

    public injuryReportStatusID: number;
    public injuredUser: string;
    public activeUser: string;

    public padding: number;

    constructor(private _injuryReportService: InjuryReportService, private router: Router, private _routerExtensions: RouterExtensions, private _settingsService: SettingsService, private _sessionService: SessionService) {

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 90;

        this.user = _sessionService.getUser();

        this.padding = _settingsService.getPadding();

    }

    public ngAfterViewInit(): void {

        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;

        this._sessionService.console("after View Init");
    }

    public ngOnInit() {

        this.loadingData = true;
        this.isBusy = true;

        this.user.injuryReportReferenceNumber = "";
        this.user.injuryReportStatusID = 0;
        this.user.injuredUser = this.injuredUser;
        this.user.activeUser = this.activeUser;

        this._injuryReportService.getUserInjuryReports(this.user)
            .subscribe(
            (user) => this.getUserInjuryReportsOnSuccess(user),
            (error) => this.getUserInjuryReportsOnError(error)
            );

    }

    private getUserInjuryReportsOnSuccess(injuryReports: Array<InjuryReport>) {

        for (let injuryReport of injuryReports) {
            this._sessionService.console(injuryReport.status);
            this.injuryReports.push(injuryReport);
        }

        this.listViewControl.refresh();

        setTimeout(() => {
            this.loadingData = false;
            this.isBusy = false;
        }, 100);

        this._sessionService.console("Done");

    }

    private getUserInjuryReportsOnError(error: TransactionalInformation) {
   
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

    public new() {

        this._sessionService.setSelectedIncidentReportString(null);
        this._sessionService.setInjuredEmployee(null);
        this._sessionService.setInjuryReport(null);
        this._sessionService.setInjuryType(null);
        this._sessionService.setBodyPartsLoadedForIncident(false);
        this._sessionService.setInitialLoadOfPhotos(true);
        this._sessionService.setReadOnly(false);
        this._sessionService.setShowEditButton(false);
        this._sessionService.setTakeOwnershipButton(false);
        
        let originalPhotos: Array<Photo> = [];
        let newPhotos: Array<Photo> = [];

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

    public onItemTap(args) {

        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);

        let index: number = args.index;
        let injuryReport: InjuryReport = this.injuryReports[index];

        this._sessionService.setSelectedIncidentReportString(injuryReport.injuryReportIDStr);
        this._sessionService.setBodyPartsLoadedForIncident(false);
        this._sessionService.setInitialLoadOfPhotos(true);
        this._sessionService.setInjuryType(null);

        this._sessionService.console("status=" + injuryReport.status);
    
        this._sessionService.setReadOnly(true);
        this._sessionService.setShowEditButton(false);
        this._sessionService.setTakeOwnershipButton(false);
        this._sessionService.setLockedByUser("");

        if (injuryReport.status == "Incomplete") {
   
            this._sessionService.console(this.user.userID + "*" + injuryReport.lockedByUserID);           

            if (this.user.userID == injuryReport.lockedByUserID) {
                this._sessionService.console("match");
                this._sessionService.setShowEditButton(true);   
                this._sessionService.console("show edit button");                                            
            }
            else {              
                this._sessionService.setTakeOwnershipButton(true);
                this._sessionService.setLockedByUser(injuryReport.activeUser);
            }
        }

        let originalPhotos: Array<Photo> = [];
        let newPhotos: Array<Photo> = [];

        this._sessionService.setOriginalPhotos(originalPhotos);    
        this._sessionService.savePhotos(newPhotos);  
     
        this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

    public ngOnDestroy() {

    }

    public logout() {

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