"use strict";
var core_1 = require("@angular/core");
var user_model_1 = require("../models/user.model");
var injuryreport_model_1 = require("../models/injuryreport.model");
var SessionService = (function () {
    function SessionService() {
        this.productionMode = true;
        this.photos = [];
        this.injuryTypes = [];
        this.originalPhotos = [];
        this.frontBodyParts = [];
        this.backBodyParts = [];
        this.initialLoadOfPhotos = true;
        this.apiServer = "";
        this.redirectUrl = "";
        this.bodyPartsLoaded = false;
        this.isDirty = false;
        this.user = new user_model_1.User();
        this.injuryType = null;
        this.injuryReport = new injuryreport_model_1.InjuryReport();
        this.showSummaryPageError = false;
        this.summaryPageError = "";
        this.readOnly = false;
        this.console("initialized session service");
    }
    SessionService.prototype.isProductionMode = function () {
        return this.productionMode;
    };
    SessionService.prototype.setIsDirty = function (dirty) {
        this.isDirty = dirty;
    };
    SessionService.prototype.getIsDirty = function () {
        return this.isDirty;
    };
    SessionService.prototype.setShowEditButton = function (boolValue) {
        this.showEditButton = boolValue;
    };
    SessionService.prototype.getShowEditButton = function () {
        return this.showEditButton;
    };
    SessionService.prototype.setLockedByUser = function (userName) {
        this.lockedByUser = userName;
    };
    SessionService.prototype.getLockedByUser = function () {
        return this.lockedByUser;
    };
    SessionService.prototype.setTakeOwnershipButton = function (boolValue) {
        this.showTakeOwnershipButton = boolValue;
    };
    SessionService.prototype.getShowTakeOwnershipButton = function () {
        return this.showTakeOwnershipButton;
    };
    SessionService.prototype.setReadOnly = function (readOnly) {
        this.readOnly = readOnly;
        this.console("readonly=" + this.readOnly);
    };
    SessionService.prototype.getReadOnly = function () {
        return this.readOnly;
    };
    SessionService.prototype.setSummaryPageError = function (error) {
        this.summaryPageError = error;
    };
    SessionService.prototype.getSummaryPageError = function () {
        return this.summaryPageError;
    };
    SessionService.prototype.setShowSummaryPageError = function (error) {
        this.showSummaryPageError = error;
    };
    SessionService.prototype.getShowSummaryPageError = function () {
        return this.showSummaryPageError;
    };
    SessionService.prototype.setBodyPartsLoaded = function (bodyPartsLoaded) {
        this.bodyPartsLoaded = bodyPartsLoaded;
    };
    SessionService.prototype.getBodyPartsLoaded = function () {
        return this.bodyPartsLoaded;
    };
    SessionService.prototype.console = function (message) {
        if (this.productionMode == true)
            return false;
        console.log(message);
    };
    SessionService.prototype.setBodyPartsLoadedForIncident = function (bodyPartsLoaded) {
        this.bodyPartsLoadedForIncident = bodyPartsLoaded;
    };
    SessionService.prototype.getBodyPartsLoadedForIncident = function () {
        return this.bodyPartsLoadedForIncident;
    };
    SessionService.prototype.setFrontBodyParts = function (bodyParts) {
        this.frontBodyParts = bodyParts;
    };
    SessionService.prototype.getFrontBodyParts = function () {
        return this.frontBodyParts;
    };
    SessionService.prototype.setBackBodyParts = function (bodyParts) {
        this.backBodyParts = bodyParts;
    };
    SessionService.prototype.getBackBodyParts = function () {
        return this.backBodyParts;
    };
    SessionService.prototype.setInjuryTypes = function (bodyParts) {
        this.backBodyParts = bodyParts;
    };
    SessionService.prototype.setInitialLoadOfPhotos = function (initialLoad) {
        this.initialLoadOfPhotos = initialLoad;
    };
    SessionService.prototype.getInitialLoadOfPhotos = function () {
        return this.initialLoadOfPhotos;
    };
    SessionService.prototype.setSelectedIncidentReportString = function (incidentNumberString) {
        this.selectedIncidentReportNumberString = incidentNumberString;
    };
    SessionService.prototype.getSelectedIncidentReportString = function () {
        return this.selectedIncidentReportNumberString;
    };
    SessionService.prototype.setApiServer = function (apiServer) {
        this.apiServer = apiServer;
    };
    SessionService.prototype.getApiServer = function () {
        return this.apiServer;
    };
    SessionService.prototype.setRedirectUrl = function (redirectUrl) {
        this.redirectUrl = redirectUrl;
    };
    SessionService.prototype.getRedirectUrl = function () {
        return this.redirectUrl;
    };
    SessionService.prototype.setUser = function (user) {
        this.user = user;
    };
    SessionService.prototype.getUser = function () {
        return this.user;
    };
    SessionService.prototype.setInjuredEmployee = function (user) {
        this.injuredEmployee = user;
    };
    SessionService.prototype.getInjuredEmployee = function () {
        return this.injuredEmployee;
    };
    SessionService.prototype.setInjuryReport = function (injuryReport) {
        this.injuryReport = injuryReport;
    };
    SessionService.prototype.getInjuryReport = function () {
        return this.injuryReport;
    };
    SessionService.prototype.savePhotos = function (photos) {
        this.photos = photos;
    };
    SessionService.prototype.setPhotoIndex = function (index) {
        this.photoIndex = index;
    };
    SessionService.prototype.setInjuryType = function (injuryType) {
        this.injuryType = injuryType;
    };
    SessionService.prototype.getInjuryType = function () {
        return this.injuryType;
    };
    SessionService.prototype.getPhotos = function () {
        return this.photos;
    };
    SessionService.prototype.getOriginalPhotos = function () {
        return this.originalPhotos;
    };
    SessionService.prototype.setOriginalPhotos = function (photos) {
        this.originalPhotos = photos;
    };
    SessionService.prototype.getPhotoIndex = function () {
        return this.photoIndex;
    };
    SessionService.prototype.saveInjuryTypes = function (injuryTypes) {
        this.injuryTypes = injuryTypes;
    };
    SessionService.prototype.getInjuryTypes = function () {
        return this.injuryTypes;
    };
    SessionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SessionService);
    return SessionService;
}());
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map