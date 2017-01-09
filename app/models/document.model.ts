export class Document {
    public documentIDStr: string;
    public injuryReportID: number
    public employerID: number;
    public carrierID: number;
    public fileName : string;
    public fileSize : number;
    public mimeType: string;
    public progress: number;
    public isUploaded: Boolean;
    public isUploading: Boolean;
    public isError: Boolean;
    public fileItem: File;
    public fileContents: string;
    public uploadedBy: number;
    public batchImportType: number;
}