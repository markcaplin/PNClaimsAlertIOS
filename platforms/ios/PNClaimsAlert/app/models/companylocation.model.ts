import { TransactionalInformation } from "./transactionalInformation.model";

export class CompanyLocation extends TransactionalInformation {

    public companyIDStr: string;
    public companyLocationIDStr: string;    
    public companyLocationID: number;
    public companyID: number;
    public locationNumber: string;
    public address1: string;
    public address2: string;
    public city: string;
    public state: string;
    public zipCode: string;
    public phoneNumber: string;
    public active: Boolean;
    public address: string;
    public activeDisplay: string;
    public status: number;

    public locations: Array<CompanyLocation>;
}