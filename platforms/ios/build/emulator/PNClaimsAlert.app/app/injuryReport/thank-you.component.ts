
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectionStrategy } from "@angular/core";
import { InjuryReport } from "../models/injuryreport.model";
import { InjuryType } from '../models/injury-type.model';

import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';
import { InjuryReportService } from '../services/injuryreport.service';

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';

import { screen } from "platform";
import * as application from "application";
import { ListView, ItemEventData } from "ui/list-view";

import * as dialogs from "ui/dialogs";

@Component({
    selector: "thank-you",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/thank-you.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})

export class ThankYouComponent implements AfterViewInit {

    @ViewChild("listView") listView: ElementRef;

    public listViewControl: ListView;

    public errorMessage: string;
    private injuryReport: InjuryReport;
    private injuryType: InjuryType;

    public injuryOccuredAtWorkplace: string;
    public needMedicalAttention: string;
    public canContinueWorking: string;
    public showCannotContinueWorking: Boolean;
    public showTypeOfInjury: Boolean;

    public injuryOccurredAtWorkYes: Boolean = false;
    public injuryOccurredAtWorkNo: Boolean = false;
    public needMedicalAttentionYes: Boolean = false;
    public needMedicalAttentionNo: Boolean = false;
    public continueWorkingYes: Boolean = false;
    public continueWorkingNo: Boolean = false;
    public showExplainInjuryLocation: Boolean = false;
    public showErrorMessage: Boolean;
    public messageBox: string;
    public errorMessages: Array<string> = [];
    public errors: Array<string> = [];

    public viewHeight: number;
    public height: number;

    constructor(private _sessionService: SessionService, private _routerExtensions: RouterExtensions, private _injuryReportService: InjuryReportService,
        private _settingsService: SettingsService, private _helperService: HelperService) {

        this._sessionService.console("Constructor begin");

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 100;

        this.injuryReport = this._sessionService.getInjuryReport();
        this.injuryType = this._sessionService.getInjuryType();

        this.messageBox = "Thank you for submitting your incident report. No further action is required on your part and you should contact your employer for further information regarding your incident.";
        
        this._sessionService.console("Constructor end");

        this._sessionService.setReadOnly(true);

    }

    public ngAfterViewInit() {

      
    }
    
    public back() {
        this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

}