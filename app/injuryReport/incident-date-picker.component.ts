
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from "@angular/core";
import { User } from "../models/user.model";
import { InjuryReport } from "../models/injuryreport.model";
import { UserService } from "../services/user.service";
import { SessionService } from "../services/session.service";
import { HelperService } from "../services/helper.service";
import { SettingsService } from '../services/settings.service';

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';

import { DatePicker } from "ui/date-picker";

@Component({
    selector: "incident-date-picker",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "injuryReport/incident-date-picker.component.html",
    providers: []
})

export class IncidentDatePickerComponent implements OnInit, AfterViewInit {

    @ViewChild('dp') datePicker: ElementRef;
    public datePickerControl: DatePicker;

    public errorMessage: string;

    private injuryReport: InjuryReport;

    public dateOfIncident: string;
    public isReadOnly: Boolean = false;

    constructor(private _sessionService: SessionService, private _userService: UserService, private _routerExtensions: RouterExtensions, private _settingsService: SettingsService, private _helperService: HelperService) {
        this.injuryReport = _sessionService.getInjuryReport();
        this.isReadOnly = this._sessionService.getReadOnly();
    }


    public ngOnInit() {

    }

    public ngAfterViewInit(): void {

        this.datePickerControl = this.datePicker.nativeElement;
        this._sessionService.console("incident date = " + this.injuryReport.dateOfIncident);

        let dateOfIncident: string = this._helperService.formatDate(this.injuryReport.dateOfIncident);

        this._sessionService.console(dateOfIncident);

        let newDate = new Date(dateOfIncident);

        this._sessionService.console("javascript incident date = " + newDate);

        this.datePickerControl.date = newDate;

    }

    public save(): void {
        this.injuryReport.dateOfIncident = this.datePickerControl.date;
        this._sessionService.setIsDirty(true);
        this._sessionService.setInjuryReport(this.injuryReport);
        this.back();
    }

    public back() {
        this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
            clearHistory: false,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    }

}