
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
    selector: "confirmation-summary",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/confirmation-summary.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: []
})

export class ConfirmationSummaryComponent implements AfterViewInit {

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
    public isReadOnly: Boolean = false;

    constructor(private _sessionService: SessionService, private _routerExtensions: RouterExtensions, private _injuryReportService: InjuryReportService,
        private _settingsService: SettingsService, private _helperService: HelperService) {

        this._sessionService.console("Constructor begin");
        this.isReadOnly = this._sessionService.getReadOnly();        

        this.showErrorMessage = false;

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 125;

        this.injuryReport = this._sessionService.getInjuryReport();
        this.injuryType = this._sessionService.getInjuryType();

        this.showTypeOfInjury = false;

        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
                this.showTypeOfInjury = true;
            }
        }

        if (this.injuryReport.injuryOccuredAtWorkplace != null) {

            if (this.injuryReport.injuryOccuredAtWorkplace == true) {
                this.injuryOccuredAtWorkplace = "Yes";
                this.injuryOccurredAtWorkYes = true;
                this.injuryOccurredAtWorkNo = false;
                this.showExplainInjuryLocation = false;
            }
            else {
                this.injuryOccuredAtWorkplace = "No";
                this.injuryOccurredAtWorkYes = false;
                this.injuryOccurredAtWorkNo = true;
                this.showExplainInjuryLocation = true;
            }

        }

        if (this.injuryReport.needMedicalAttention != null) {
            if (this.injuryReport.needMedicalAttention == true) {
                this.needMedicalAttention = "Yes";
                this.needMedicalAttentionYes = true;
                this.needMedicalAttentionNo = false;
            }
            else {
                this.needMedicalAttention = "No";
                this.needMedicalAttentionYes = false;
                this.needMedicalAttentionNo = true;
            }
        }

        this.showCannotContinueWorking = false;

        if (this.injuryReport.canContinueWorking != null) {
            if (this.injuryReport.canContinueWorking == true) {
                this.canContinueWorking = "Yes"
                this.continueWorkingYes = true;
                this.continueWorkingNo = false;
            }
            else {
                this.canContinueWorking = "No";
                this.showCannotContinueWorking = true;
                this.continueWorkingYes = false;
                this.continueWorkingNo = true;
            }
        }

        this._sessionService.console("Constructor end");

    }

    public ngAfterViewInit() {

        //this.listViewControl = this.listView.nativeElement;
        //this.listViewControl.height = 10;
    }

    public injuryOccurredAtWork(selectedValue: string) {

        this.injuryOccuredAtWorkplace = selectedValue;
        this.injuryReport.injuryAtWorkplaceSelected = true;
        this.injuryReport.injuryOccuredAtWorkplace = false;
        if (selectedValue == "Yes") {
            this.injuryReport.injuryOccuredAtWorkplace = true;
            this.injuryOccurredAtWorkYes = true;
            this.injuryOccurredAtWorkNo = false;
            this.showExplainInjuryLocation = false;
        }
        else {
            this.injuryOccurredAtWorkYes = false;
            this.injuryOccurredAtWorkNo = true;
            this.showExplainInjuryLocation = true;
        }

    }

    public medicalAttentionNeeded(selectedValue: string) {

        this.needMedicalAttention = selectedValue;
        this.injuryReport.needMedicalAttentionSelected = true;
        this.injuryReport.needMedicalAttention = false;
        if (selectedValue == "Yes") {
            this.injuryReport.needMedicalAttention = true;
            this.needMedicalAttentionYes = true;
            this.needMedicalAttentionNo = false;
        }
        else {
            this.needMedicalAttentionYes = false;
            this.needMedicalAttentionNo = true;
        }

    }

    public continueWorking(selectedValue: string) {

        this.canContinueWorking = selectedValue;
        this.injuryReport.canContinueWorking = false;
        this.injuryReport.canContinueWorkingSelected = true;
        this.showCannotContinueWorking = true;
        if (selectedValue == "Yes") {
            this.injuryReport.canContinueWorking = true;
            this.showCannotContinueWorking = false;
            this.continueWorkingYes = true;
            this.continueWorkingNo = false;
        }
        else {
            this.continueWorkingYes = false;
            this.continueWorkingNo = true;
        }

    }

    public home() {

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

    public submit(): void {

        this.showErrorMessage = false;

        let injuryReport = new InjuryReport();
        injuryReport.injuryReportID = this.injuryReport.injuryReportID;

        this._injuryReportService.submitToEmployer(this.injuryReport)
            .subscribe(
            (submit) => this.submitToEmployerOnSuccess(submit),
            (error) => this.submitToEmployerOnError(error)
            );

    }

    private submitToEmployerOnSuccess(response: InjuryReport): void {

        this._sessionService.setSummaryPageError("");
        this._sessionService.setShowSummaryPageError(false);

        this._routerExtensions.navigate(["/injuryreport/thankyou"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    }

    private submitToEmployerOnError(response: InjuryReport): void {

        this._sessionService.console("show error messages...");

        let errorMessage = "";
        this.showErrorMessage = true;
        for (var i = 0; i < response.returnMessage.length; i++) {
            errorMessage = errorMessage + response.returnMessage[i] + "\n";
            this._sessionService.console(response.returnMessage[i]);
        }

        dialogs.alert({
            title: "Submission Invalid.",
            message: errorMessage,
            okButtonText: "OK"
        }).then(function  () {
           
        });        
    
    }

    public back() {
        this._routerExtensions.navigate(["/injuryreport/additionalquestions"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

}