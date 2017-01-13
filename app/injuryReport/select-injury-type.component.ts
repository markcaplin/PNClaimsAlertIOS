import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output, ViewChild, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { InjuryReportService } from '../services/injuryreport.service';
import { SessionService } from '../services/session.service';
import { SettingsService } from '../services/settings.service';

import { InjuryReport } from '../models/injuryreport.model';
import { InjuryType } from '../models/injury-type.model';

import { TransactionalInformation } from '../models/transactionalinformation.model';
import { NS_ROUTER_DIRECTIVES, RouterExtensions } from 'nativescript-angular/router';
import { screen } from "platform";
import * as application from "application";

import { ListView, ItemEventData } from "ui/list-view";


@Component({
    templateUrl: 'injuryReport/select-injury-type.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SelectInjuryTypeComponent implements AfterViewInit {

    @ViewChild("listView") listView: ElementRef;

    public injuryTypes: Array<InjuryType> = [];
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
    public padding: Number;
    
    constructor(
        private _injuryReportService: InjuryReportService, 
        private router: Router, 
        private _routerExtensions: RouterExtensions, 
        private _settingsService: SettingsService, 
        private _sessionService: SessionService) {

        this.viewHeight = screen.mainScreen.heightDIPs;
        this.scrollHeight = this.viewHeight - 90;
        this.padding = this._settingsService.getPadding();
  
    }

    public ngAfterViewInit(): void {

        this.listViewControl = this.listView.nativeElement;
        this.listViewControl.height = this.scrollHeight;

        this._sessionService.console("after View Init " + this.listViewControl);

        let injuryTypes: Array<InjuryType> = this._sessionService.getInjuryTypes();
        this._sessionService.console("injury types = " + injuryTypes.length);

        if (injuryTypes.length > 0) {
            for (let injuryType of injuryTypes) {
                this.injuryTypes.push(injuryType);
            }
            this.listViewControl.refresh();
            return;
        }

        this.loadingData = true;
        this.isBusy = true;

        this._injuryReportService.getInjuryTypes()
            .subscribe(
            (response) => this.getInjuryTypesOnSuccess(response),
            (error) => this.getInjuryTypesOnError(error)
            );
    }

    private getInjuryTypesOnSuccess(response: InjuryType[]) {

        for (let injuryType of response) {
            this.injuryTypes.push(injuryType);
        }

        this._sessionService.saveInjuryTypes(this.injuryTypes);
        this.listViewControl.refresh();

        setTimeout(() => {
            this.loadingData = false;
            this.isBusy = false;
        }, 100);

        this._sessionService.console("Done");
    }

    private getInjuryTypesOnError(response: TransactionalInformation) {

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

    public onItemTap(args) {
        this._sessionService.console("on item tap");
        this._sessionService.console("------------------------ ItemTapped: " + args.index);
        let index: number = args.index;
        let injuryType: InjuryType = this.injuryTypes[index];
        this._sessionService.setInjuryType(injuryType);
        this._sessionService.setIsDirty(true);
        this.back();
    }

    public ngOnDestroy() {

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