import { TransactionalInformation } from "./transactionalInformation.model";

export class InjuryReportHistory extends TransactionalInformation {

    public injuryReportIDStr: string;
    public injuryReportAuditFieldID: number;
    public injuryReportAuditFieldDesc: string;
    public oldValue: string;
    public newValue: string;
    public createdBy: string;
    public dateCreated: Date;
   
    public histories: Array<InjuryReportHistory>;
}

