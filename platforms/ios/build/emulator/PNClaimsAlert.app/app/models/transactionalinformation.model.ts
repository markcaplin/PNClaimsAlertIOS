export class TransactionalInformation {
    public returnStatus: Boolean;
    public returnMessage: string[] = [];        
    public validationErrors: any[] = [];
    public currentPageNumber: number;   
    public totalPages: number;    
    public totalRows: number;    
    public pageSize: number;   
    public sortExpression: string;
    public sortDirection: string; 
    public statusCode: number;      
}

