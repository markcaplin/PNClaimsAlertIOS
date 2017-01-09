
import { Component, OnInit, AfterViewInit } from "@angular/core";
import { InjuryReport } from "../models/injuryreport.model";
import { InjuryType } from '../models/injury-type.model';

import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';
import { InjuryReportService } from "../services/injuryreport.service";

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';

import { screen } from "platform";
import * as application from "application";
import * as dialogs from "ui/dialogs";

@Component({
    selector: "additional-questions",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/additional-questions.component.html",
    providers: []
})

export class AdditionalQuestionsComponent implements AfterViewInit {

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
    public showErrorMessage: Boolean = false;

    public viewHeight: number;
    public height: number;
    private buttonPressed: string;
    private initialLoad: Boolean = true;
    private modelChangCount: number = 0;
    public isReadOnly: Boolean = false;
    public isEditable: Boolean = false;
    public isBusy: Boolean = false;
    public showEditButton: Boolean = false;
    public takingOwnership: Boolean = false;   
    public showTakeOwnershipButton: Boolean = false;
    public padding: Number;
  
    constructor(private _sessionService: SessionService, private _routerExtensions: RouterExtensions, private _injuryReportService: InjuryReportService,
        private _settingsService: SettingsService, private _helperService: HelperService) {

        this.padding = _settingsService.getPadding();
            
        this._sessionService.console("Constructor start");

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.height = this.viewHeight - 145;

        this.isReadOnly = this._sessionService.getReadOnly();        
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();

        this.injuryReport = this._sessionService.getInjuryReport();

        this.injuryType = this._sessionService.getInjuryType();

        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            this._sessionService.console("type of illness recorded = " + this.injuryReport.typeOfInjuryOrIllness);
            this._sessionService.setInjuryReport(this.injuryReport);         
        }

        this._sessionService.console("Constructor ending with update " + this.isReadOnly);

    }

    public ngAfterViewInit() {

        this._sessionService.console("ngAfterViewInit");

        let injuryTypes: Array<InjuryType> = this._sessionService.getInjuryTypes();

        this._sessionService.console("injury types = " + injuryTypes.length);

        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            this._sessionService.console("type of illness recorded = " + this.injuryReport.typeOfInjuryOrIllness);         
        }

        if (injuryTypes.length > 0) {
            this.setValues();
            return;
        }

        this._sessionService.console("get injury types");

        this._injuryReportService.getInjuryTypes()
            .subscribe(
            (response) => this.getInjuryTypesOnSuccess(response),
            (error) => this.getInjuryTypesOnError(error)
            );

    }

    private setValues() {

        this._sessionService.console("set values called");

        if (this.injuryType != null) {
            this.injuryReport.typeOfInjuryOrIllness = this.injuryType.injuryTypeDescription;
            this._sessionService.console("type of illness recorded = " + this.injuryReport.typeOfInjuryOrIllness);
            this._sessionService.setInjuryReport(this.injuryReport);
            this._sessionService.setInjuryType(null);
        }

        let injuryTypes = this._sessionService.getInjuryTypes();

        this.injuryReport = this._sessionService.getInjuryReport();
        this.showTypeOfInjury = false;

        //this._sessionService.console("type of illness = " + this.injuryType.injuryTypeDescription);
        this._sessionService.console("type of illness = " + this.injuryReport.typeOfInjuryOrIllness);

        this._sessionService.console("need medical attention " + this.injuryReport.needMedicalAttention);

        let isOtherType: Boolean = true;
        for (var i = 0; i < injuryTypes.length; i++) {
            if (this.injuryReport.typeOfInjuryOrIllness == injuryTypes[i].injuryTypeDescription ) {
                isOtherType = false;
                this._sessionService.setInjuryType(injuryTypes[i]);
                break;
            }
        }       

        if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
            isOtherType = true;           
        }

        if (this.injuryReport.typeOfInjuryOrIllness == null) {
            isOtherType = false;
        }

        if (isOtherType) {
            this._sessionService.console("Other illness");
            if (this.injuryReport.typeOfInjury == null) {
                this.injuryReport.typeOfInjury = this.injuryReport.typeOfInjuryOrIllness;
                this.injuryReport.typeOfInjuryOrIllness = "Other";
            }
            this.showTypeOfInjury = true;
            for (var i = 0; i < injuryTypes.length; i++) {
                if ("Other" == injuryTypes[i].injuryTypeDescription) {
                    this._sessionService.setInjuryType(injuryTypes[i]);
                    break;
                }
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
         

    }

    private getInjuryTypesOnSuccess(injuryTypes: InjuryType[]) {

        this._sessionService.saveInjuryTypes(injuryTypes);    
        this._sessionService.console("Done");

        this.injuryReport.needMedicalAttentionSelected = true;
        if (this.injuryReport.needMedicalAttention == null) {
            this.injuryReport.needMedicalAttentionSelected = false;
        }

        this.injuryReport.injuryAtWorkplaceSelected = true;
        if (this.injuryReport.injuryOccuredAtWorkplace == null) {
            this.injuryReport.injuryAtWorkplaceSelected = false;
        }

        this.injuryReport.canContinueWorkingSelected = true;
        if (this.injuryReport.canContinueWorking == null) {
            this.injuryReport.canContinueWorkingSelected = false;
        }

        this.setValues();       
    }

    private getInjuryTypesOnError(response: TransactionalInformation) {
       //this.loadingData = false;
       // this.isBusy = false;
    }


    public injuryOccurredAtWork(selectedValue: string) {

        this._sessionService.setIsDirty(true);

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

        this._sessionService.setIsDirty(true);

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

        this._sessionService.setIsDirty(true);

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


    public onModelChange() {       
        if (this.initialLoad == true) return false;
        this._sessionService.setIsDirty(true);
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

        this._sessionService.console("is dirty =" + this._sessionService.getIsDirty());

        if (this._sessionService.getIsDirty() == false) {
            if (this.buttonPressed == "back") {
                this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionSlideRight,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
                return;
            }
            else if (this.buttonPressed == "forward") {
                this._routerExtensions.navigate(["/injuryreport/confirmationsummary"], {
                    clearHistory: false,
                    transition: {
                        name: this._settingsService.transitionSlideRight,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });
                return;
            }
        }

        this.showErrorMessage = false;
        this._sessionService.setInjuryReport(this.injuryReport);

        let injuryReport = new InjuryReport();

        injuryReport.injuryReportID = this.injuryReport.injuryReportID;
        injuryReport.injuryReportIDStr = this.injuryReport.injuryReportIDStr;
        injuryReport.injuryOccuredAtWorkplace = this.injuryReport.injuryOccuredAtWorkplace;
        injuryReport.needMedicalAttention = this.injuryReport.needMedicalAttention;
        injuryReport.canContinueWorking = this.injuryReport.canContinueWorking;
        injuryReport.explanationOfInjuryLocation = this.injuryReport.explanationOfInjuryLocation;
        injuryReport.injuredWorkerEmailAddress = this.injuryReport.injuredWorkerEmailAddress;
        injuryReport.injuredWorkerPhoneNumber = this.injuryReport.injuredWorkerPhoneNumber;
        injuryReport.whyCannotContinueWorking = this.injuryReport.whyCannotContinueWorking;
        injuryReport.treatmentDescription = this.injuryReport.treatmentDescription;
        injuryReport.howDidInjuryOrIllnessOccur = this.injuryReport.howDidInjuryOrIllnessOccur;
        injuryReport.typeOfInjuryOrIllness = this.injuryReport.typeOfInjuryOrIllness;

        if (this.injuryReport.typeOfInjuryOrIllness == "Other") {
            injuryReport.typeOfInjuryOrIllness = this.injuryReport.typeOfInjury;          
        }

        this._sessionService.console("type of illness = " + injuryReport.typeOfInjuryOrIllness);

        if (this.injuryReport.injuryOccuredAtWorkplace == true) {
            injuryReport.explanationOfInjuryLocation = null;
        }

        if (this.injuryReport.canContinueWorking == true) {
            injuryReport.whyCannotContinueWorking = null;
        }
        
        this._injuryReportService.saveInjuryInfo(injuryReport)
            .subscribe(
            (response) => this.saveInjuryInfoOnSuccess(response),
            (error) => this.saveInjuryInfoOnError(error)
            );

    }

    private saveInjuryInfoOnSuccess(response: InjuryReport) {

        this._sessionService.setIsDirty(false);

        if (this.buttonPressed == "back") {
            this._routerExtensions.navigate(["/injuryreport/takepicture"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
            return;
        }
        else if (this.buttonPressed == "forward") {
            this._routerExtensions.navigate(["/injuryreport/confirmationsummary"], {
                clearHistory: false,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });
            return;
        }

        this.buttonPressed = "";

        dialogs.alert({

            title: "Saved",
            message: "Information successfully saved.",
            okButtonText: "OK"                        

        }).then(function () {                        
                                                 
        });      


    }

    private saveInjuryInfoOnError(response: TransactionalInformation) {

        this.showErrorMessage = true;
        this.buttonPressed = "";
        this.errorMessage = "";
        
        for (var i = 0; i < response.returnMessage.length; i++) {
            this.errorMessage = this.errorMessage + response.returnMessage[i];
        }

        dialogs.alert({

            title: "Validation Error",
            message: this.errorMessage,
            okButtonText: "OK"                        

        }).then(function () {                        
                                                 
        });      

    }



    public back() {
  
        this.isBusy = true;

        setTimeout(() => {
            this.buttonPressed = "back";
            this.save();   
        }, 100);

    }

    public forward() {

        this.isBusy = true;

        setTimeout(() => {

            this.buttonPressed = "forward";
            this.save();     

        }, 100);


    }

    public searchForInjuryTypes() {
        this._sessionService.setInjuryReport(this.injuryReport);
        this._routerExtensions.navigate(["/injuryreport/selectinjurytype"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
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