import { TransactionalInformation } from "./transactionalinformation.model";

export class BodyPart extends TransactionalInformation {

    public bodyPartID: number;
    public bodyPartIDStr: string;
    public injuryReportIDStr: string;
    public name: string;
    public location: number;
    public imageSourcePath: string;
    public htmlTitle: string;
    public coordinates: string;
    public doNotAdd: boolean;

    public addedBodyParts: Array<BodyPart>;
    public removedBodyParts: Array<BodyPart>;
    public bodyParts: Array<BodyPart>;


}