import { CompanyType } from "./companyType.model";
import { CompanyLocation } from "./companyLocation.model";
import { TransactionalInformation } from "./transactionalinformation.model";

import { User } from "./user.model";

export class  Company extends TransactionalInformation  {

    public companyID: number;
    public companyName: string;
    public address1: string;
    public address2: string;
    public city: string;
    public state: string;
    public zipCode: string;
    public phoneNumber: string;
    public active: boolean;
    public countActiveEmployees: number;
    public countInActiveEmployees: number;
    public mainContactUserID: number;
    public companyType: CompanyType;
    public users: User[];
    public companyIDStr: string;
    public notificationIntervalHours: number;    
    public contactName: string;  
    public contactEmailAddress: string;
    public contactPhoneNumber: string;
    public contactFirstName: string;
    public contactMiddleName: string;
    public contactLastName: string;
    public contactUserID: number;
    public policyNumber: string;
    public federalEmployerID: string;
    public companyLocations: CompanyLocation[];
    public locationNumber: string;
    public status: number;



}