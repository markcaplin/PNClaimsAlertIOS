"use strict";
var core_1 = require("@angular/core");
var router_1 = require('nativescript-angular/router');
var http_service_1 = require("./services/http.service");
var session_service_1 = require("./services/session.service");
var injuryreport_service_1 = require("./services/injuryreport.service");
var user_service_1 = require("./services/user.service");
var helper_service_1 = require("./services/helper.service");
var settings_service_1 = require("./services/settings.service");
var http_1 = require("nativescript-angular/http");
var http_2 = require('@angular/http');
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: "pn-claims-alert",
            directives: [router_1.NS_ROUTER_DIRECTIVES],
            providers: [http_1.NS_HTTP_PROVIDERS, http_2.HTTP_PROVIDERS, session_service_1.SessionService, injuryreport_service_1.InjuryReportService, user_service_1.UserService, http_service_1.HttpService, helper_service_1.HelperService, settings_service_1.SettingsService],
            template: "<page-router-outlet></page-router-outlet>"
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map