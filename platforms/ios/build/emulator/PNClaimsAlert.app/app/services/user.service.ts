import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { HttpService } from "./http.service";
import { User } from "../models/user.model";
import { ChangePassword } from "../models/changePassword.model";

@Injectable()
export class UserService {

    private loginUrl: string = "api/UserService/Login";
    private authenticateUrl: string = "api/UserService/Authenticate";
    private forgotPasswordUrl: string = 'api/UserService/ForgotPassword';
    private getUserUrl: string = 'api/UserService/GetUser';
    private changePasswordUrl: string = 'api/UserService/ChangePassword';
    private getUserEmailUrl: string = 'api/UserService/GetUserEmail';
    private getUserRegistrationUrl: string = 'api/UserService/GetUserRegistration';
    private registerUrl: string = 'api/UserService/Register';
    private updateUserProfileUrl: string = 'api/UserService/UpdateUserProfile';
    private searchUsersUrl: string = 'api/UserService/SearchUsers';

    public userAuthenticationEvent: EventEmitter<User>;

    constructor(private _httpService: HttpService) {

        this.userAuthenticationEvent = new EventEmitter<User>();
    }

    public login(user: User): Observable<any> {
        return this._httpService.httpPost(user, this.loginUrl);
    }

    public authenticate(): Observable<any> {
        return this._httpService.httpPost(null, this.authenticateUrl);
    }

    public forgotPassword(user: User): Observable<any> {
        return this._httpService.httpPost(user, this.forgotPasswordUrl);
    }

    public getUser(user: User) {
        return this._httpService.httpPost(user, this.getUserUrl);
    }

    public changePassword(changePassword: ChangePassword) {
        return this._httpService.httpPost(changePassword, this.changePasswordUrl);
    }

    public getUserEmail(user: User) {
        return this._httpService.httpPost(user, this.getUserEmailUrl);
    }

    public getUserRegistration(user: User) {
        return this._httpService.httpPost(user, this.getUserRegistrationUrl);
    }

    public register(user: User) {
        return this._httpService.httpPost(user, this.registerUrl);
    }

    public updateUserProfile(user: User) {
        return this._httpService.httpPost(user, this.updateUserProfileUrl);
    }

    public searchUsers(userInformation: User): Observable<any> {
        return this._httpService.httpPost(userInformation, this.searchUsersUrl);
    }
}