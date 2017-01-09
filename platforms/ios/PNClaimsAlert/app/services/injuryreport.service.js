"use strict";
var core_1 = require("@angular/core");
var http_service_1 = require("./http.service");
var InjuryReportService = (function () {
    function InjuryReportService(_httpService) {
        this._httpService = _httpService;
        this.searchEmployeesUrl = "api/InjuryReportService/SearchEmployees";
        this.saveInjuredEmployeeUrl = "api/InjuryReportService/SaveInjuredEmployee";
        this.submitToEmployerUrl = "api/InjuryReportService/SubmitToEmployer";
        this.getUserInjuryReportsUrl = "api/InjuryReportService/GetUserInjuryReports";
        this.getNumberOfInjuryReportsForUserUrl = "api/InjuryReportService/GetNumberOfInjuryReportsForUser";
        this.getInjuryReportUrl = "api/InjuryReportService/GetInjuryReport";
        this.lockInjuryReportUrl = "api/InjuryReportService/LockInjuryReport";
        this.saveInjuryInfoUrl = "api/InjuryReportService/SaveInjuryInfo";
        this.getInjuryTypesUrl = "api/InjuryReportService/GetInjuryTypes";
        this.uploadDocumentUrl = "api/InjuryReportService/UploadDocument";
        this.deleteDocumentUrl = "api/InjuryReportService/DeleteDocument";
        this.getInjuryReportDocumentsUrl = "api/InjuryReportService/GetInjuryReportDocuments";
        this.getBodyPartsForFrontUrl = "api/InjuryReportService/GetBodyPartsForFront";
        this.getBodyPartsForBackUrl = "api/InjuryReportService/GetBodyPartsForBack";
        this.getBodyPartsForInjuryReportUrl = "api/InjuryReportService/GetBodyPartsForInjuryReport";
        this.saveInjuryReportBodyPartsUrl = "api/InjuryReportService/SaveInjuryReportBodyParts";
        this.getNotReportedReasonsUrl = "api/InjuryReportService/GetNotReportedReasons";
        this.completeReportUrl = "api/InjuryReportService/CompleteReport";
        this.cancelInjuryReportUrl = "api/InjuryReportService/CancelInjuryReport";
        this.duplicateInjuryReportUrl = "api/InjuryReportService/DuplicateInjuryReport";
        this.searchInjuryReportHistoryUrl = "api/InjuryReportService/SearchInjuryReportHistory";
        this.getInjuryReportAuditFieldsUrl = "api/InjuryReportService/GetInjuryReportAuditFields";
    }
    InjuryReportService.prototype.duplicateInjuryReport = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.duplicateInjuryReportUrl);
    };
    InjuryReportService.prototype.cancelInjuryReport = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.cancelInjuryReportUrl);
    };
    InjuryReportService.prototype.saveInjuryReportBodyParts = function (bodyPartInformation) {
        return this._httpService.httpPost(bodyPartInformation, this.saveInjuryReportBodyPartsUrl);
    };
    InjuryReportService.prototype.getBodyPartsForInjuryReport = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.getBodyPartsForInjuryReportUrl);
    };
    InjuryReportService.prototype.searchEmployees = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.searchEmployeesUrl);
    };
    InjuryReportService.prototype.getInjuryReport = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.getInjuryReportUrl);
    };
    InjuryReportService.prototype.lockInjuryReport = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.lockInjuryReportUrl);
    };
    InjuryReportService.prototype.saveInjuredEmployee = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.saveInjuredEmployeeUrl);
    };
    InjuryReportService.prototype.submitToEmployer = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.submitToEmployerUrl);
    };
    InjuryReportService.prototype.getUserInjuryReports = function (user) {
        return this._httpService.httpPost(user, this.getUserInjuryReportsUrl);
    };
    InjuryReportService.prototype.getNumberOfInjuryReportsForUser = function (user) {
        return this._httpService.httpPost(user, this.getNumberOfInjuryReportsForUserUrl);
    };
    InjuryReportService.prototype.saveInjuryInfo = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.saveInjuryInfoUrl);
    };
    InjuryReportService.prototype.getInjuryTypes = function () {
        return this._httpService.httpPost(null, this.getInjuryTypesUrl);
    };
    InjuryReportService.prototype.uploadDocument = function (document) {
        return this._httpService.httpPost(document, this.uploadDocumentUrl);
    };
    InjuryReportService.prototype.deleteDocument = function (document) {
        return this._httpService.httpPost(document, this.deleteDocumentUrl);
    };
    InjuryReportService.prototype.getInjuryReportDocuments = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.getInjuryReportDocumentsUrl);
    };
    InjuryReportService.prototype.getBodyPartsForFront = function () {
        return this._httpService.httpPost(null, this.getBodyPartsForFrontUrl);
    };
    InjuryReportService.prototype.getBodyPartsForBack = function () {
        return this._httpService.httpPost(null, this.getBodyPartsForBackUrl);
    };
    //public getInjuryReportStatuses(): InjuryReportStatus[] {
    //    let injuryReportStatuses: Array<InjuryReportStatus> = [];
    //    let injuryReportStatus = new InjuryReportStatus();
    //    injuryReportStatus.injuryReportStatusID = 1;
    //    injuryReportStatus.description = "Incomplete";
    //    injuryReportStatuses.push(injuryReportStatus);
    //    injuryReportStatus = new InjuryReportStatus();
    //    injuryReportStatus.injuryReportStatusID = 2;
    //    injuryReportStatus.description = "Pending Employer Update";
    //    injuryReportStatuses.push(injuryReportStatus);
    //    injuryReportStatus = new InjuryReportStatus();
    //    injuryReportStatus.injuryReportStatusID = 3;
    //    injuryReportStatus.description = "Will Not Be Reported";
    //    injuryReportStatuses.push(injuryReportStatus);
    //    injuryReportStatus = new InjuryReportStatus();
    //    injuryReportStatus.injuryReportStatusID = 4;
    //    injuryReportStatus.description = "Reported";
    //    injuryReportStatuses.push(injuryReportStatus);
    //    injuryReportStatus = new InjuryReportStatus();
    //    injuryReportStatus.injuryReportStatusID = 5;
    //    injuryReportStatus.description = "Cancelled";
    //    injuryReportStatuses.push(injuryReportStatus);
    //    return injuryReportStatuses;
    //}
    InjuryReportService.prototype.getNotReportedReasons = function () {
        return this._httpService.httpPost(null, this.getNotReportedReasonsUrl);
    };
    InjuryReportService.prototype.completeReport = function (injuryReport) {
        return this._httpService.httpPost(injuryReport, this.completeReportUrl);
    };
    InjuryReportService.prototype.searchInjuryReportHistory = function (injuryReportHistory) {
        return this._httpService.httpPost(injuryReportHistory, this.searchInjuryReportHistoryUrl);
    };
    InjuryReportService.prototype.getInjuryReportAuditFields = function () {
        return this._httpService.httpPost(null, this.getInjuryReportAuditFieldsUrl);
    };
    InjuryReportService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_service_1.HttpService])
    ], InjuryReportService);
    return InjuryReportService;
}());
exports.InjuryReportService = InjuryReportService;
//# sourceMappingURL=injuryreport.service.js.map