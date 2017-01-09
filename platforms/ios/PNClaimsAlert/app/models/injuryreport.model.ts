import { User } from "./user.model";
import { InjuryType } from "./injury-type.model";
import { TransactionalInformation } from "./transactionalinformation.model";
import { BodyPart } from "./bodyPart.model";
import { Document } from "./document.model";
import { IncidentReporting } from "./incidentReporting.model";

export class InjuryReport extends TransactionalInformation {

    public injuryReportIDStr: string;
    public employeeName: string;
    public referenceNumber: number;
    public injuryReportID: number;
    public injuredEmployeeID: number;
    public injuredEmployeeDateOfBirth: Date;
    public dateOfIncident: Date;
    public users: User[];
    public injuredEmployee: User;
    public explanationOfInjuryLocation: string;
    public injuryOccuredAtWorkplace: Boolean;
    public injuryAtWorkplaceSelected: Boolean;
    public lockedByUserID: number;
    public lockedByUser: User;
    public typeOfInjury: string;

    public typeOfInjuryOrIllness: string;
        
    public howDidInjuryOrIllnessOccur: string;
    public needMedicalAttention: Boolean;
    public needMedicalAttentionSelected: Boolean;
    public treatmentDescription: string;
    public canContinueWorking: Boolean;
    public canContinueWorkingSelected: Boolean;
    public whyCannotContinueWorking: string;
    public injuredWorkerPhoneNumber: string;
    public injuredWorkerEmailAddress: string;

    public injuryReportStatusID: number;
    public injuryReportStatusDescription: string;
    public injuryTypes: InjuryType[];
    public bodyParts: Array<BodyPart>;
    public uploadedDocuments: Document[];
    public incidentReports: Array<IncidentReporting>;
    public injuredEmployeeName: string;
    public reportingEmployeeName: string;
    public status: string;
    public dateCreated: Date;
    public dateUpdated: Date;
     
    public notReportedReasonID: number;
    public notReportedReasonOther: string;
    public notes: string; 
    public cancelledReason: string;

    public duplicateInjuryReport: Boolean;
    public injuredEmployeeIDStr: string;
    public includeFileContents: Boolean;
    public activeUser: string;
    public injuredUser: string;
    public injuredUserID: string;   
  
}