"use strict";
var core_1 = require("@angular/core");
var http_service_1 = require("./http.service");
var UserService = (function () {
    function UserService(_httpService) {
        this._httpService = _httpService;
        this.loginUrl = "api/UserService/Login";
        this.authenticateUrl = "api/UserService/Authenticate";
        this.forgotPasswordUrl = 'api/UserService/ForgotPassword';
        this.getUserUrl = 'api/UserService/GetUser';
        this.changePasswordUrl = 'api/UserService/ChangePassword';
        this.getUserEmailUrl = 'api/UserService/GetUserEmail';
        this.getUserRegistrationUrl = 'api/UserService/GetUserRegistration';
        this.registerUrl = 'api/UserService/Register';
        this.updateUserProfileUrl = 'api/UserService/UpdateUserProfile';
        this.searchUsersUrl = 'api/UserService/SearchUsers';
        this.userAuthenticationEvent = new core_1.EventEmitter();
    }
    UserService.prototype.login = function (user) {
        return this._httpService.httpPost(user, this.loginUrl);
    };
    UserService.prototype.authenticate = function () {
        return this._httpService.httpPost(null, this.authenticateUrl);
    };
    UserService.prototype.forgotPassword = function (user) {
        return this._httpService.httpPost(user, this.forgotPasswordUrl);
    };
    UserService.prototype.getUser = function (user) {
        return this._httpService.httpPost(user, this.getUserUrl);
    };
    UserService.prototype.changePassword = function (changePassword) {
        return this._httpService.httpPost(changePassword, this.changePasswordUrl);
    };
    UserService.prototype.getUserEmail = function (user) {
        return this._httpService.httpPost(user, this.getUserEmailUrl);
    };
    UserService.prototype.getUserRegistration = function (user) {
        return this._httpService.httpPost(user, this.getUserRegistrationUrl);
    };
    UserService.prototype.register = function (user) {
        return this._httpService.httpPost(user, this.registerUrl);
    };
    UserService.prototype.updateUserProfile = function (user) {
        return this._httpService.httpPost(user, this.updateUserProfileUrl);
    };
    UserService.prototype.searchUsers = function (userInformation) {
        return this._httpService.httpPost(userInformation, this.searchUsersUrl);
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_service_1.HttpService])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map