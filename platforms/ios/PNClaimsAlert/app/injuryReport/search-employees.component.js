"use strict";
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var injuryreport_service_1 = require('../services/injuryreport.service');
var session_service_1 = require('../services/session.service');
var settings_service_1 = require('../services/settings.service');
var user_model_1 = require('../models/user.model');
var injuryreport_model_1 = require('../models/injuryreport.model');
var router_2 = require('nativescript-angular/router');
var platform_1 = require("platform");
var SearchEmployeesComponent = (function () {
    function SearchEmployeesComponent(_injuryReportService, router, _routerExtensions, _settingsService, _sessionService) {
        this._injuryReportService = _injuryReportService;
        this.router = router;
        this._routerExtensions = _routerExtensions;
        this._settingsService = _settingsService;
        this._sessionService = _sessionService;
        this.employees = [];
        this.columns = [];
        this.alerts = [];
        this.currentPageNumber = 1;
        this.currentPageNumber = 1;
        this.autoFilter = false;
        this.totalPages = 0;
        this.totalRows = 0;
        this.pageSize = 15;
        this.sortDirection = "ASC";
        this.sortExpression = "LastName";
        this.employeeName = "";
        this.totalRecordsMessage = "";
        this.viewHeight = platform_1.screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 160;
        this.padding = this._settingsService.getPadding();
        //application.on(application.orientationChangedEvent, this.setOrientation);
    }
    SearchEmployeesComponent.prototype.ngAfterViewInit = function () {
        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;
        this.SearchBarControl = this.searchBar.nativeElement;
        this._sessionService.console("after View Init");
    };
    SearchEmployeesComponent.prototype.onSubmit = function (employeeName) {
        this._sessionService.console("employee name=" + employeeName);
        this.currentPageNumber = 1;
        this.employeeName = employeeName;
        this.employees = [];
        this.executeSearch();
    };
    SearchEmployeesComponent.prototype.onItemTap = function (args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        var index = args.index;
        var employee = this.employees[index];
        this._sessionService.setInjuredEmployee(employee);
        var injuryReport = this._sessionService.getInjuryReport();
        injuryReport.injuredEmployee = employee;
        injuryReport.injuredEmployeeID = employee.userID;
        this._sessionService.setInjuryReport(injuryReport);
        this._sessionService.setIsDirty(true);
        this.back();
    };
    SearchEmployeesComponent.prototype.onClear = function () {
        this._sessionService.console("onclear");
        this.totalRecordsMessage = "";
        this.employees = [];
        this.listViewControl.refresh();
    };
    SearchEmployeesComponent.prototype.listViewLoadMoreItems = function (args) {
        this._sessionService.console("more items");
        if (this.totalPages == 0)
            return;
        if (this.currentPageNumber == this.totalPages)
            return;
        this.currentPageNumber = this.currentPageNumber + 1;
        this.executeSearch();
    };
    SearchEmployeesComponent.prototype.ngOnInit = function () {
    };
    SearchEmployeesComponent.prototype.ngOnDestroy = function () {
        //application.off(application.orientationChangedEvent);
    };
    //public setOrientation(args) {
    //    this.viewHeight = screen.mainScreen.heightDIPs;
    //    this.scrollHeight = this.viewHeight - 160;
    //    this.listViewControl.height = this.scrollHeight;
    //   this._sessionService.console(args.newValue);
    //    this.viewHeight = screen.mainScreen.heightDIPs;
    //   this._sessionService.console(this.viewHeight + " " + this.scrollHeight);
    //}
    SearchEmployeesComponent.prototype.executeSearch = function () {
        var _this = this;
        this.SearchBarControl.dismissSoftInput();
        if (this.loadingData == true)
            return;
        this.loadingData = true;
        this.isBusy = true;
        var injuryReport = new injuryreport_model_1.InjuryReport();
        injuryReport.employeeName = this.employeeName;
        injuryReport.pageSize = this.pageSize;
        injuryReport.sortDirection = this.sortDirection;
        injuryReport.sortExpression = this.sortExpression;
        injuryReport.currentPageNumber = this.currentPageNumber;
        this._injuryReportService.searchEmployees(injuryReport)
            .subscribe(function (search) { return _this.executeSearchOnSuccess(search); }, function (error) { return _this.executeSearchOnError(error); });
    };
    SearchEmployeesComponent.prototype.executeSearchOnSuccess = function (injuryReport) {
        var _this = this;
        this.totalPages = injuryReport.totalPages;
        this.totalRows = injuryReport.totalRows;
        this._sessionService.console("employees=" + injuryReport.totalRows);
        var totalRows = injuryReport.users.length;
        for (var i = 0; i < totalRows; i++) {
            var employee = new user_model_1.User();
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
            var employee = new user_model_1.User();
            employee.firstName = "";
            employee.lastName = "";
            employee.emailAddress = "";
            this.employees.push(employee);
        }
        this.listViewControl.refresh();
        this._sessionService.console("done searching");
        if (totalRows > 0) {
            setTimeout(function () {
                _this.totalRecordsMessage = "showing " + _this.employees.length + " of " + _this.totalRows + " employees.";
            }, 100);
        }
        else {
            setTimeout(function () {
                _this.totalRecordsMessage = "no matches found.";
            }, 100);
        }
    };
    SearchEmployeesComponent.prototype.executeSearchOnError = function (response) {
        this.isBusy = true;
        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    SearchEmployeesComponent.prototype.back = function () {
        this._routerExtensions.navigate(["/injuryreport/injuredemployee"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionSlideRight,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });
    };
    __decorate([
        core_1.ViewChild("listView"), 
        __metadata('design:type', core_1.ElementRef)
    ], SearchEmployeesComponent.prototype, "listView", void 0);
    __decorate([
        core_1.ViewChild('sb'), 
        __metadata('design:type', core_1.ElementRef)
    ], SearchEmployeesComponent.prototype, "searchBar", void 0);
    SearchEmployeesComponent = __decorate([
        core_1.Component({
            templateUrl: 'injuryReport/search-employees.component.html',
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [injuryreport_service_1.InjuryReportService, router_1.Router, router_2.RouterExtensions, settings_service_1.SettingsService, session_service_1.SessionService])
    ], SearchEmployeesComponent);
    return SearchEmployeesComponent;
}());
exports.SearchEmployeesComponent = SearchEmployeesComponent;
//# sourceMappingURL=search-employees.component.js.map