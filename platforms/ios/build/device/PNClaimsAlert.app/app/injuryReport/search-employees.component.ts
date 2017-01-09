import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { InjuryReportService } from '../services/injuryreport.service';
import { SessionService } from '../services/session.service';
import { SettingsService } from '../services/settings.service';

import { User } from '../models/user.model';
import { InjuryReport } from '../models/injuryreport.model';

import { TransactionalInformation } from '../models/transactionalinformation.model';
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';
import { screen } from "platform";
import * as application from "application";

import { ListView, ItemEventData } from "ui/list-view";
import { SearchBar } from "ui/search-bar";

import { SegmentedBar, SegmentedBarItem, SelectedIndexChangedEventData } from 'ui/segmented-bar';


@Component({
    templateUrl: 'injuryReport/search-employees.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SearchEmployeesComponent implements OnInit, AfterViewInit {


    @ViewChild("listView") listView: ElementRef;
    @ViewChild('sb') searchBar: ElementRef;

    public employees: Array<User> = [];
    public columns = [];

    public alerts: Array<string> = [];
    public messageBox: string;

    public totalRows: number;
    public currentPageNumber: number = 1;
    public totalPages: number;
    public pageSize: number;
    private sortDirection: string;
    private sortExpression: string;

    public autoFilter: Boolean;
    public delaySearch: Boolean;
    public runningSearch: Boolean;
    public searchValue: string;

    public viewHeight: number;
    public scrollHeight: number;

    public listViewControl: ListView;
    public SearchBarControl: SearchBar;
    public loadingData: Boolean;
    public isBusy: Boolean;

    public totalRowsDisplay: number;
    public totalRecordsMessage: string;
    public selectedIndex: number;

    public employeeName: string;

    constructor(private _injuryReportService: InjuryReportService, private router: Router, private _routerExtensions: RouterExtensions, private _settingsService: SettingsService, private _sessionService: SessionService) {

        this.currentPageNumber = 1;
        this.autoFilter = false;
        this.totalPages = 0;
        this.totalRows = 0;
        this.pageSize = 15;
        this.sortDirection = "ASC";
        this.sortExpression = "LastName";
        this.employeeName = "";
        this.totalRecordsMessage = "";

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 160;

        //application.on(application.orientationChangedEvent, this.setOrientation);

    }

    public ngAfterViewInit(): void {

        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;

        this.SearchBarControl = this.searchBar.nativeElement;

        this._sessionService.console("after View Init");
    }

    public onSubmit(employeeName) {
        this._sessionService.console("employee name=" + employeeName);
        this.currentPageNumber = 1;
        this.employeeName = employeeName;
        this.employees = [];
        this.executeSearch();
    }

    public onItemTap(args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        let index: number = args.index;
        let employee: User = this.employees[index];
        this._sessionService.setInjuredEmployee(employee);

        let injuryReport: InjuryReport = this._sessionService.getInjuryReport();
        injuryReport.injuredEmployee = employee;
        injuryReport.injuredEmployeeID = employee.userID;
        this._sessionService.setInjuryReport(injuryReport);
        this._sessionService.setIsDirty(true);

        this.back();
    }


    public onClear() {

        this._sessionService.console("onclear");

        this.totalRecordsMessage = "";
        this.employees = [];
        this.listViewControl.refresh();

    }

    public listViewLoadMoreItems(args) {

        this._sessionService.console("more items");

        if (this.totalPages == 0) return;

        if (this.currentPageNumber == this.totalPages) return;
        this.currentPageNumber = this.currentPageNumber + 1;
        this.executeSearch();

    }

    public ngOnInit() {

    }

    public ngOnDestroy() {
        //application.off(application.orientationChangedEvent);
    }

    //public setOrientation(args) {

    //    this.viewHeight = screen.mainScreen.heightDIPs;
    //    this.scrollHeight = this.viewHeight - 160;
    //    this.listViewControl.height = this.scrollHeight;

    //   this._sessionService.console(args.newValue);
    //    this.viewHeight = screen.mainScreen.heightDIPs;
    //   this._sessionService.console(this.viewHeight + " " + this.scrollHeight);

    //}

    private executeSearch(): void {

        this.SearchBarControl.dismissSoftInput();

        if (this.loadingData == true) return;

        this.loadingData = true;
        this.isBusy = true;

        let injuryReport = new InjuryReport();
        injuryReport.employeeName = this.employeeName;
        injuryReport.pageSize = this.pageSize;
        injuryReport.sortDirection = this.sortDirection;
        injuryReport.sortExpression = this.sortExpression;
        injuryReport.currentPageNumber = this.currentPageNumber;

        this._injuryReportService.searchEmployees(injuryReport)
            .subscribe(
            (search) => this.executeSearchOnSuccess(search),
            (error) => this.executeSearchOnError(error)
            );

    }

    private executeSearchOnSuccess(injuryReport: InjuryReport): void {

        this.totalPages = injuryReport.totalPages;
        this.totalRows = injuryReport.totalRows;

        this._sessionService.console("employees=" + injuryReport.totalRows);

        let totalRows = injuryReport.users.length;

        for (var i = 0; i < totalRows; i++) {

            let employee = new User();

            employee.firstName = injuryReport.users[i].firstName;
            employee.lastName = injuryReport.users[i].lastName;
            employee.emailAddress = injuryReport.users[i].emailAddress;
            employee.userID = injuryReport.users[i].userID;
            employee.dateOfBirth = injuryReport.users[i].dateOfBirth;

            this.employees.push(employee);

            this._sessionService.console("users= " + injuryReport.users[i].lastName);

        }

        this.loadingData = false;
        this.isBusy = false;

        if (totalRows == 0) {
            let employee = new User();
            employee.firstName = "";
            employee.lastName = "";
            employee.emailAddress = "";
            this.employees.push(employee);
        }

        this.listViewControl.refresh();

        this._sessionService.console("done searching");

        if (totalRows > 0) {
            setTimeout(() => {
                this.totalRecordsMessage = "showing " + this.employees.length + " of " + this.totalRows + " employees.";
            }, 100);

        }
        else {
            setTimeout(() => {
                this.totalRecordsMessage = "no matches found.";
            }, 100);

        }


    }

    private executeSearchOnError(response): void {

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