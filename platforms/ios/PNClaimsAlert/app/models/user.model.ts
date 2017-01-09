import { Company } from "./company.model";
import { CompanyLocation } from "./companylocation.model";
import { InjuryReport } from "./injuryreport.model";
import { Role } from "./role.model";
import { TransactionalInformation } from "./transactionalinformation.model";
import { MenuItemInformation } from "./menuItemInformation.model";

export class User extends TransactionalInformation {

    public userID: number;
    public firstName: string;
    public lastName: string;
    public middleName: string;
    public emailAddress: string;  
    public phoneNumber: string;
    public password: string;
    public confirmPassword: string;
    public temporaryPassword: string;
    public active: boolean;
    public dateOfBirth: Date;
    public company: Company;
    public injuryReports: InjuryReport[];
    public roles: Role[];
    public userIDStr: string;
    public landingPage: string;
    public companyIDStr: string;
    public companyLocationIDStr: string;
    public companyLocation: CompanyLocation;
    public companyName: string;
    public companyTypeName: string;
    public companyTypeID: number;
    public federalEmployerID: string;
    public policyNumber: string;
    public menuItems: MenuItemInformation[];
    public numberOfReports: number;

    public isAuthenticated: boolean;
    public isAdmin: boolean;

    public users: Array<User>;

    public injuryReportReferenceNumber: string;
    public injuryReportStatusID: number;
    public injuredUser: string;
    public activeUser: string;
    public isTechSupport: boolean;

    constructor() {

        super();
        this.isAuthenticated = false;
    }
}

