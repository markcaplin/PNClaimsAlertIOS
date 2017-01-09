import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Headers, RequestOptions } from '@angular/http';

import { SessionService } from './session.service';
import { User } from "../models/user.model";

import * as applicationSettings from "application-settings";

import 'rxjs/Rx';
import "rxjs/add/operator/do";
import 'rxjs/add/operator/map';

@Injectable()
export class HttpService {

    constructor(private _http: Http, private _sessionService: SessionService) {}

    public httpPost(object: any, url: string): Observable<any> {
      
        let route = "http://qaapi.pnclaimsalert.com/" + url;

       this._sessionService.console("route = " + route);

       // alert(route);

        let body = JSON.stringify(object);

       this._sessionService.console("body=" + body);

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'q=0.8;application/json;q=0.9');

        let authorizationToken = applicationSettings.getString("authorizationToken");
        if (authorizationToken != null) {
            headers.append('Authorization', authorizationToken);
        }

       this._sessionService.console("token=" + authorizationToken);

        let options = new RequestOptions({ headers: headers });

        return this._http.post(route, body, options).map((response) => this.parseResponse(response))
            .catch((err) => this.handleError(err));

    }

    private handleError(error: any) {

        let body = error.json();

        //this._settingsService.console("log error = " + body);

       // alert("error=" + body);

        return Observable.throw(body);

    }

    private parseResponse(response: Response) {

        let authorizationToken = response.headers.get("Authorization");
       this._sessionService.console(authorizationToken);
        if (authorizationToken != null) {
            if (authorizationToken.length > 0) {
                applicationSettings.setString("authorizationToken", authorizationToken);
            }
        }

       this._sessionService.console("Response = " + response);
        let body = response.json();

       this._sessionService.console("Response body = " + body);

       //this._sessionService.console("log body=" + body);
       // alert("log body=" + body);

        return body;
    }

}