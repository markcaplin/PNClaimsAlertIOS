
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { User } from "../models/user.model";
import { InjuryReport } from "../models/injuryreport.model";
import { UserService } from "../services/user.service";
import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';
import { InjuryReportService } from "../services/injuryreport.service";

import { BodyPart } from "../models/bodyPart.model";

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';

import * as dialogs from "ui/dialogs";
import { DatePicker } from "ui/date-picker";


@Component({
    selector: "injured-employee",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/injured-employee.component.html",
    providers: []
})

export class InjuredEmployeeComponent implements AfterViewInit {

    @ViewChild('dp') datePicker: ElementRef;
    public datePickerControl: DatePicker;

    public emailAddress: string;
    public password: string;
    public hostName: string;
    public firstName: string;
    public lastName: string;
    public userName: string;
    public items: Array<any>;
    public selectedIndex: number;
    public errorMessage: string;
    public messageBox: string;
    public showErrorMessage: Boolean = false;

    private user: User;
    private injuredEmployee: User;
    private injuryReport: InjuryReport;

    public injuredEmployeeName: string;
    public dateOfIncident: string;
    public dateOfBirth: string

    public selectedInjuryReportIDStr: string = null;
    private injuryReportIDStr: string;
    public injuryReportID: number = 0;
    private buttonPressed: string;
    public isBusy: Boolean = false;
    public isReadOnly: Boolean = false;
    public showEditButton: Boolean = false;
    public showTakeOwnershipButton: Boolean = false;
    public takingOwnership: Boolean = false;
    public padding: number;
    public datePickerHeight: number = 0;
 
    constructor(private _sessionService: SessionService, private _userService: UserService, private _routerExtensions: RouterExtensions, private _settingsService: SettingsService, private _helperService: HelperService, private _injuryReportService: InjuryReportService) {

        this.padding = this._settingsService.getPadding();
        this.datePickerHeight = 0;
        this.selectedInjuryReportIDStr = this._sessionService.getSelectedIncidentReportString();
        this.user = _sessionService.getUser();

        this._sessionService.console("dirty=" + this._sessionService.getIsDirty());

        this.isReadOnly = this._sessionService.getReadOnly();
        this.showEditButton = this._sessionService.getShowEditButton();
        this.showTakeOwnershipButton = this._sessionService.getShowTakeOwnershipButton();

        this._sessionService.console("show edit button = " + this.showEditButton);
    
        if (this.selectedInjuryReportIDStr == null) {

            this.injuredEmployee = _sessionService.getInjuredEmployee();

            if (this.injuredEmployee == null) {

                let injuredEmployee = new User();
                injuredEmployee.firstName = this.user.firstName;
                injuredEmployee.lastName = this.user.lastName;
                injuredEmployee.dateOfBirth = this.user.dateOfBirth;
                injuredEmployee.userID = this.user.userID;

                this.injuredEmployee = injuredEmployee;
                this._sessionService.setInjuredEmployee(injuredEmployee);

                let currentDate: Date = new Date();

                let injuryReport = new InjuryReport();
                injuryReport.dateOfIncident = currentDate;
                this.injuryReport = injuryReport;
                this.injuryReport.bodyParts = [];

                this.injuryReport.injuredEmployee = this.injuredEmployee;
                this.injuryReport.injuredEmployeeID = this.injuredEmployee.userID;

                this._sessionService.console("injured employee id = " + this.injuryReport.injuredEmployeeID);

                this._sessionService.setInjuryReport(injuryReport);

            }
            else {
                this.injuredEmployee = _sessionService.getInjuredEmployee();
                this.injuryReport = _sessionService.getInjuryReport();
            }

            this.setValues();

        }
        else {

            let injuryReport = new InjuryReport();
            injuryReport.injuryReportIDStr = this.selectedInjuryReportIDStr;
            this.injuryReportIDStr = this.selectedInjuryReportIDStr;

            this.selectedInjuryReportIDStr == null;
            this._sessionService.setSelectedIncidentReportString(null);

            this._injuryReportService.getInjuryReport(injuryReport)
                .subscribe(
                (search) => this.getInjuryReportOnSuccess(search),
                (error) => this.getInjuryReportOnError(error)
                );

        }

    }

    public ngAfterViewInit(): void {        
        this.datePickerControl = this.datePicker.nativeElement;
        this.datePickerHeight = 0;              
    }
    
    private edit() {
        this.isReadOnly = false;
        this.showEditButton = false;
        this._sessionService.setShowEditButton(false);
        this._sessionService.setReadOnly(false);
    }

    private setValues() {

        this.injuredEmployeeName = this.injuredEmployee.firstName + " " + this.injuredEmployee.lastName;

        this.dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);

        let dateOfBirth = this._helperService.convertJsonDateToJavaScriptDate(this.injuredEmployee.dateOfBirth);
        this.dateOfBirth = this._helperService.formatDate(dateOfBirth);

        this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);

        let dateOfIncident: string = this._helperService.formatDate(this.injuryReport.dateOfIncident);

        this._sessionService.console(dateOfIncident);

        let newDate = new Date(dateOfIncident);

        this._sessionService.console("javascript incident date = " + newDate);

        if (this.datePicker == undefined) {
            return;
        }
    
        this.datePickerControl.date = newDate;
        this.datePickerHeight = 0;

    }

    private getInjuryReportOnSuccess(injuryReport: InjuryReport) {

        this.injuredEmployee = injuryReport.injuredEmployee;
        this.injuryReport = injuryReport;
        this.injuryReportID = injuryReport.injuryReportID;

        this.injuryReport.injuryReportIDStr = this.injuryReportIDStr;

        this._sessionService.console("ID==" + this.injuryReportIDStr);

        this._sessionService.setInjuredEmployee(this.injuredEmployee);
        this._sessionService.setInjuryReport(this.injuryReport);
    
        this.setValues();

    }

    private getInjuryReportOnError(response: TransactionalInformation) {

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

    public back() {

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

    public toggleDatePicker() {

        if (this.datePickerHeight==125) {
            this.datePickerHeight = 0;
        }
        else {

            this.datePickerHeight = 125;
                            
            this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);
            let dateOfIncident: string = this._helperService.formatDate(this.injuryReport.dateOfIncident);
            this._sessionService.console(dateOfIncident);
            let newDate = new Date(dateOfIncident);
            this._sessionService.console("javascript incident date = " + newDate);
            this.datePickerControl.date = newDate;        

        }
       // this._routerExtensions.navigate(["/injuryreport/datepicker"], {
       //     clearHistory: false,
       //     transition: {
       //         name: this._settingsService.transitionName,
       //         duration: this._settingsService.transitionDuration,
       //         curve: this._settingsService.transitionCurve
       //     }
       // });

    }

    public dateChanged(property: any, oldValue: any, newValue: any): void {

        let currentDate: Date = this.datePickerControl.date;

        setTimeout(() => {

                if (currentDate == this.datePickerControl.date) {
                    return;
                }
        
                let today = new Date();                              
                if (this.datePickerControl.date>today) {

                    let dateOfIncident: string = this._helperService.formatDate(this.datePickerControl.date);             
          
                    dialogs.alert({

                        title: "Invalid Incident Date.",
                        message: "Reported incident date of " + dateOfIncident + " cannot be in the future",
                        okButtonText: "OK"                        

                    }).then(function () {                        
                                                 
                    });      

                     this.datePickerControl.date = currentDate;  

                    return;

                }

                this.injuryReport.dateOfIncident = this.datePickerControl.date;
                this._sessionService.setIsDirty(true);                          
                this.dateOfIncident = this._helperService.formatDate(this.injuryReport.dateOfIncident);             

            }, 100);

    }


    public forward() {

        this.isBusy = true;

        setTimeout(() => {

            this._sessionService.console("forward dirty =" + this._sessionService.getIsDirty());

            this._sessionService.console("forward");
            this.buttonPressed = "forward";
            this.showErrorMessage = false;
            this.injuryReport = this._sessionService.getInjuryReport();

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

            if (this._sessionService.getIsDirty() == true || this.injuryReportID == 0) {

                this._injuryReportService.duplicateInjuryReport(this.injuryReport)
                    .subscribe(
                    (injuryReport) => this.duplicateInjuryReportOnSuccess(injuryReport),
                    (error) => this.duplicateInjuryReportOnError(error)
                    );

            }
            else {

                this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                    clearHistory: true,
                    transition: {
                        name: this._settingsService.transitionName,
                        duration: this._settingsService.transitionDuration,
                        curve: this._settingsService.transitionCurve
                    }
                });

            }
          
           
        }, 100);

    }

    public save() {

        this.isBusy = true;

        this.buttonPressed = "save";
        this._sessionService.console("save");
        this.showErrorMessage = false;
        this.injuryReport = this._sessionService.getInjuryReport();

        this._sessionService.console("injury report id = " + this.injuryReport.injuryReportID);
        this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);
        this._sessionService.console("injured employee = " + this.injuryReport.injuredEmployeeID);

        this._injuryReportService.duplicateInjuryReport(this.injuryReport)
            .subscribe(
            (injuryReport) => this.duplicateInjuryReportOnSuccess(injuryReport),
            (error) => this.duplicateInjuryReportOnError(error)
            );

    }

    private duplicateInjuryReportOnSuccess(response: InjuryReport) {

        this._sessionService.console("duplicate Injury Report On Success");

        if (response.duplicateInjuryReport) {

            this.isBusy = false;
            
            this.messageBox = "An injury already exists for the same user and incident date";

            dialogs.alert({
                    title: "Validation Error",
                    message: this.messageBox,
                    okButtonText: "OK"
                    }).then(function () {});                              

        }
        else {

            this.continueWithSave();
        }
    }

    private duplicateInjuryReportOnError(response: TransactionalInformation) {

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

    private continueWithSave() {

        this._sessionService.console("Continue with Save");

        this._injuryReportService.saveInjuredEmployee(this.injuryReport)
            .subscribe(
            (search) => this.saveInjuredEmployeeOnSuccess(search),
            (error) => this.saveInjuredEmployeeOnError(error)
            );
    }

    private saveInjuredEmployeeOnSuccess(response: InjuryReport) {

        this._sessionService.setIsDirty(false);
        this.isBusy = false;

        if (this.buttonPressed == "back") {        

            this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionSlideRight,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });

        }
        else if (this.buttonPressed == "forward") {        

            this._routerExtensions.navigate(["/injuryreport/bodypartpicker"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionName,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });

        }
        else {

            if (this.injuryReport.injuryReportID == 0) {
                this.injuryReport.injuryReportID = response.injuryReportID;
                this.injuryReportID = response.injuryReportID;
                this.injuryReport.injuryReportIDStr = response.injuryReportIDStr;
                this._sessionService.setInjuryReport(this.injuryReport);

            }

            this.buttonPressed = "";
            this._sessionService.console("success=" + this.injuryReport.injuryReportID);

            dialogs.alert({

                title: "Saved.",
                message: "Information successfully saved",
                okButtonText: "OK"                        

            }).then(function () {                        
                                                 
            });      

        }
       
    }

    private saveInjuredEmployeeOnError(error: TransactionalInformation) {

        this.messageBox = "";
        this.isBusy = false;

        if (error != null && error.returnMessage != null) {
            this._sessionService.console("error message returned");
            if (error != null && error.returnMessage.length > 0) {
                this.messageBox = error.returnMessage[0];
            }
        }
     
        dialogs.alert({
            title: "Validation Error",
            message: this.messageBox,
            okButtonText: "OK"
        }).then(function () {});    

        this._sessionService.console("error " + this.messageBox);
        
    }

    public searchForEmployee() {
        this._routerExtensions.navigate(["/injuryreport/searchemployees"], {
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
                injuryReport.injuryReportIDStr = this.injuryReportIDStr;

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