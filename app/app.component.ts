import { Component } from "@angular/core";
import { NS_ROUTER_DIRECTIVES } from 'nativescript-angular/router';

import { HttpService } from "./services/http.service";
import { SessionService } from "./services/session.service";
import { InjuryReportService } from "./services/injuryreport.service";
import { UserService } from "./services/user.service";
import { HelperService } from "./services/helper.service";
import { SettingsService } from "./services/settings.service";

import { NS_HTTP_PROVIDERS } from "nativescript-angular/http";
import { HTTP_PROVIDERS } from '@angular/http';

@Component({
    selector: "pn-claims-alert",
    directives: [NS_ROUTER_DIRECTIVES],
    providers: [NS_HTTP_PROVIDERS, HTTP_PROVIDERS, SessionService, InjuryReportService, UserService, HttpService, HelperService, SettingsService],
    template: `<page-router-outlet></page-router-outlet>`
})

export class AppComponent {}




