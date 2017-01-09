
import { Component, OnInit, OnDestroy, ViewChild, ElementRef} from "@angular/core";
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';
import { User } from "../models/user.model";
import { UserService } from "../services/user.service";
import { SessionService } from "../services/session.service";

import { InjuryReportService } from "../services/injuryreport.service";

import { TransactionalInformation } from "../models/transactionalinformation.model";
import { SettingsService } from '../services/settings.service';
import { Photo } from '../models/photo.model';

import { Page } from "ui/page";

import * as dialogs from "ui/dialogs";
import * as application from "application";

@Component({
    selector: "login",
    directives: [NS_ROUTER_DIRECTIVES],
    templateUrl: "account/login.component.html",
    providers: []
})

export class LoginComponent implements OnInit {

    public padding: number;
    public emailAddress: string;
    public password: string;
    public hostName: string;
    public firstName: string;
    public lastName: string;
    public userName: string;
    public items: Array<any>;
    public selectedIndex: number;
    public messageBox: string;
    public showErrorMessage: Boolean;

    private transitionList = ["fade", "flip", "slide"];
    public transitions: Array<string>;

    @ViewChild("password") passwordElement: ElementRef;

    constructor(private page: Page, private _sessionService: SessionService, private _userService: UserService,
        private _injuryReportService: InjuryReportService,
        private _routerExtensions: RouterExtensions, private _settingsService: SettingsService) {

        this.padding = this._settingsService.getPadding();
        
        this.emailAddress = "mcaplin@patnat.com";
        this.password = "test";
        this.messageBox = "";
        this.showErrorMessage = false;

        this.transitions = [];

        for (var i = 0; i < this.transitionList.length; i++) {
            this.transitions.push(this.transitionList[i]);
        }

        //application.on(application.orientationChangedEvent, this.setOrientation);


    }

           
    public focusPassword() {
        
        dialogs.alert({
                title: "focus password event.",
                message: "focus",
                okButtonText: "OK"
            }).then(function () {

            });    

        this.passwordElement.nativeElement.focus();
    }

    public setOrientation(args) {
        this.padding = this._settingsService.getPadding();        
    }

    public ngOnInit() {        
        this.page.className = "coverImage";
    }

    public ngOnDestroy() {
       // application.off(application.orientationChangedEvent);
    }

    public selectedIndexChanged(picker) {
        let transition: string = this.transitions[picker.selectedIndex];
        this._settingsService.transitionName = transition;
        this._settingsService.transitionSlideRight = transition;
    }

    public login() {

        let user = new User();
        user.emailAddress = this.emailAddress;
        user.password = this.password;

        //alert(user.emailAddress + " " + user.password);

        this._userService.login(user)
            .subscribe(
            (user) => this.loginOnSuccess(user),
            (error) => this.loginOnError(error)
            );

    }

    private loginOnSuccess(user: User) {

        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.userName = user.firstName + " " + user.lastName + " " + user.userID;

        //alert("loggedin as " + this.userName);
        this._sessionService.console("logged in as " + user.userID);
        this._sessionService.setUser(user);

        this._injuryReportService.getNumberOfInjuryReportsForUser(user)
            .subscribe(
            (user) => this.getNumberOfInjuryReportsForUserOnSuccess(user),
            (error) => this.getNumberOfInjuryReportsForUserOnError(error)
            );

    }

    private getNumberOfInjuryReportsForUserOnSuccess(response: User) {

        this._sessionService.console("number of injuryReports = " + response.numberOfReports);

        if (response.numberOfReports > 0) {

            this._routerExtensions.navigate(["/injuryreport/injuryreports"], {
                clearHistory: true,
                transition: {
                    name: this._settingsService.transitionName,
                    duration: this._settingsService.transitionDuration,
                    curve: this._settingsService.transitionCurve
                }
            });

        }
        else {

            this._sessionService.setSelectedIncidentReportString(null);
            this._sessionService.setInjuredEmployee(null);
            this._sessionService.setInjuryReport(null);
            this._sessionService.setInjuryType(null);
            this._sessionService.setBodyPartsLoadedForIncident(false);
            this._sessionService.setInitialLoadOfPhotos(true);
            this._sessionService.setReadOnly(false);
            this._sessionService.setShowEditButton(false);
            this._sessionService.setTakeOwnershipButton(false);
            this._sessionService.setLockedByUser("");

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

    }

    private getNumberOfInjuryReportsForUserOnError(error: TransactionalInformation) {

        this._routerExtensions.navigate(["/account/login"], {
            clearHistory: true,
            transition: {
                name: this._settingsService.transitionName,
                duration: this._settingsService.transitionDuration,
                curve: this._settingsService.transitionCurve
            }
        });

    }

    private loginOnError(error: TransactionalInformation) {

        if (error != null && error.returnMessage != null) {

            this._sessionService.console("error " + error);

            let errorMessage = "";
            for (var i = 0; i < error.returnMessage.length; i++) {
                errorMessage = errorMessage + error.returnMessage[i] + "\n";
                this._sessionService.console(error.returnMessage[i]);
            }

            dialogs.alert({
                title: "Login invalid.",
                message: errorMessage,
                okButtonText: "OK"
            }).then(function () {

            });      

        }       

    }

}