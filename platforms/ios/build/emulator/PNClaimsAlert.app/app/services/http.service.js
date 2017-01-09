"use strict";
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var http_2 = require('@angular/http');
var session_service_1 = require('./session.service');
var applicationSettings = require("application-settings");
require('rxjs/Rx');
require("rxjs/add/operator/do");
require('rxjs/add/operator/map');
var HttpService = (function () {
    function HttpService(_http, _sessionService) {
        this._http = _http;
        this._sessionService = _sessionService;
    }
    HttpService.prototype.httpPost = function (object, url) {
        var _this = this;
        var route = "http://qaapi.pnclaimsalert.com/" + url;
        this._sessionService.console("route = " + route);
        // alert(route);
        var body = JSON.stringify(object);
        this._sessionService.console("body=" + body);
        var headers = new http_2.Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'q=0.8;application/json;q=0.9');
        var authorizationToken = applicationSettings.getString("authorizationToken");
        if (authorizationToken != null) {
            headers.append('Authorization', authorizationToken);
        }
        this._sessionService.console("token=" + authorizationToken);
        var options = new http_2.RequestOptions({ headers: headers });
        return this._http.post(route, body, options).map(function (response) { return _this.parseResponse(response); })
            .catch(function (err) { return _this.handleError(err); });
    };
    HttpService.prototype.handleError = function (error) {
        var body = error.json();
        //this._settingsService.console("log error = " + body);
        // alert("error=" + body);
        return Observable_1.Observable.throw(body);
    };
    HttpService.prototype.parseResponse = function (response) {
        var authorizationToken = response.headers.get("Authorization");
        this._sessionService.console(authorizationToken);
        if (authorizationToken != null) {
            if (authorizationToken.length > 0) {
                applicationSettings.setString("authorizationToken", authorizationToken);
            }
        }
        this._sessionService.console("Response = " + response);
        var body = response.json();
        this._sessionService.console("Response body = " + body);
        //this._sessionService.console("log body=" + body);
        // alert("log body=" + body);
        return body;
    };
    HttpService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, session_service_1.SessionService])
    ], HttpService);
    return HttpService;
}());
exports.HttpService = HttpService;
//# sourceMappingURL=http.service.js.map