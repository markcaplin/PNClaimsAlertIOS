import { Injectable, EventEmitter } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { HttpService } from "./http.service";
import { InjuryReport } from "../models/injuryreport.model";
//import { InjuryReportStatus } from "../models/injuryreportstatus.model";
import { Document } from "../models/Document.model";
import { User } from "../models/user.model";
import { BodyPart } from "../models/bodyPart.model";
import { InjuryReportHistory } from "../models/injuryReportHistory.model";

@Injectable()
export class InjuryReportService {

    private searchEmployeesUrl: string = "api/InjuryReportService/SearchEmployees";
    private saveInjuredEmployeeUrl: string = "api/InjuryReportService/SaveInjuredEmployee";
    private submitToEmployerUrl: string = "api/InjuryReportService/SubmitToEmployer";
    private getUserInjuryReportsUrl: string = "api/InjuryReportService/GetUserInjuryReports";
    private getNumberOfInjuryReportsForUserUrl: string = "api/InjuryReportService/GetNumberOfInjuryReportsForUser";
    private getInjuryReportUrl: string = "api/InjuryReportService/GetInjuryReport";
    private lockInjuryReportUrl: string = "api/InjuryReportService/LockInjuryReport";
    private saveInjuryInfoUrl: string = "api/InjuryReportService/SaveInjuryInfo";
    private getInjuryTypesUrl: string = "api/InjuryReportService/GetInjuryTypes";
    private uploadDocumentUrl: string = "api/InjuryReportService/UploadDocument";
    private deleteDocumentUrl: string = "api/InjuryReportService/DeleteDocument";
    private getInjuryReportDocumentsUrl: string = "api/InjuryReportService/GetInjuryReportDocuments";
    private getBodyPartsForFrontUrl: string = "api/InjuryReportService/GetBodyPartsForFront";
    private getBodyPartsForBackUrl: string = "api/InjuryReportService/GetBodyPartsForBack";
    private getBodyPartsForInjuryReportUrl: string = "api/InjuryReportService/GetBodyPartsForInjuryReport";
    private saveInjuryReportBodyPartsUrl: string = "api/InjuryReportService/SaveInjuryReportBodyParts";
    private getNotReportedReasonsUrl: string = "api/InjuryReportService/GetNotReportedReasons";
    private completeReportUrl: string = "api/InjuryReportService/CompleteReport";
    private cancelInjuryReportUrl: string = "api/InjuryReportService/CancelInjuryReport";
    private duplicateInjuryReportUrl: string = "api/InjuryReportService/DuplicateInjuryReport";
    private searchInjuryReportHistoryUrl: string = "api/InjuryReportService/SearchInjuryReportHistory";
    private getInjuryReportAuditFieldsUrl: string = "api/InjuryReportService/GetInjuryReportAuditFields";

    constructor(private _httpService: HttpService) {
        
    }

    public duplicateInjuryReport(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.duplicateInjuryReportUrl);
    }

    public cancelInjuryReport(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.cancelInjuryReportUrl);
    }

    public saveInjuryReportBodyParts(bodyPartInformation: BodyPart): Observable<any> {
        return this._httpService.httpPost(bodyPartInformation, this.saveInjuryReportBodyPartsUrl);
    }

    public getBodyPartsForInjuryReport(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.getBodyPartsForInjuryReportUrl);
    }
 
    public searchEmployees(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.searchEmployeesUrl);
    }

    public getInjuryReport(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.getInjuryReportUrl);
    }

    public lockInjuryReport(injuryReport: InjuryReport): Observable<any> {       
        return this._httpService.httpPost(injuryReport, this.lockInjuryReportUrl);
    }

    public saveInjuredEmployee(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.saveInjuredEmployeeUrl);
    }

    public submitToEmployer(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.submitToEmployerUrl);
    }

    public getUserInjuryReports(user: User): Observable<any> {
        return this._httpService.httpPost(user, this.getUserInjuryReportsUrl);
    }
   
    public getNumberOfInjuryReportsForUser(user: User): Observable<any> {
        return this._httpService.httpPost(user, this.getNumberOfInjuryReportsForUserUrl);
    }

    public saveInjuryInfo(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.saveInjuryInfoUrl);
    }

    public getInjuryTypes(): Observable<any> {
        return this._httpService.httpPost(null, this.getInjuryTypesUrl);
    }

    public uploadDocument(document: Document): Observable<any> {
        return this._httpService.httpPost(document, this.uploadDocumentUrl);
    }

    public deleteDocument(document: Document): Observable<any> {
        return this._httpService.httpPost(document, this.deleteDocumentUrl);
    }

    public getInjuryReportDocuments(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.getInjuryReportDocumentsUrl);
    }
   

    public getBodyPartsForFront(): Observable<any> {
        return this._httpService.httpPost(null, this.getBodyPartsForFrontUrl);
    }

    public getBodyPartsForBack(): Observable<any> {
        return this._httpService.httpPost(null, this.getBodyPartsForBackUrl);
    }

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

    public getNotReportedReasons(): Observable<any> {
        return this._httpService.httpPost(null, this.getNotReportedReasonsUrl);
    }

    public completeReport(injuryReport: InjuryReport): Observable<any> {
        return this._httpService.httpPost(injuryReport, this.completeReportUrl);
    }

    public searchInjuryReportHistory(injuryReportHistory: InjuryReportHistory): Observable<any> {
        return this._httpService.httpPost(injuryReportHistory, this.searchInjuryReportHistoryUrl);
    }

    public getInjuryReportAuditFields(): Observable<any> {
        return this._httpService.httpPost(null, this.getInjuryReportAuditFieldsUrl);
    }

}