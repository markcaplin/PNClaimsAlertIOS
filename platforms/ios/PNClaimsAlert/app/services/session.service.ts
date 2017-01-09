import { Injectable } from "@angular/core";

import { User } from "../models/user.model";
import { InjuryReport } from "../models/injuryreport.model";
import { InjuryType } from "../models/injury-type.model";

import { Photo } from "../models/photo.model";
import { BodyPart } from "../models/bodyPart.model";

@Injectable()
export class SessionService {

    private productionMode: Boolean = false;

    private apiServer: string;
    private redirectUrl: string;
    private user: User;
    private injuredEmployee: User;
    private injuryReport: InjuryReport;
    private injuryType: InjuryType;
    private photos: Array<Photo> = [];
    private injuryTypes: Array<InjuryType> = [];
    private photoIndex: number;
    private selectedIncidentReportNumberString: string;
    private isDirty: Boolean;
    private initialLoadOfPhotos: Boolean;
    private originalPhotos: Array<Photo> = [];

    private frontBodyParts: Array<BodyPart> = [];
    private backBodyParts: Array<BodyPart> = [];
    private bodyPartsLoaded: Boolean;
    private bodyPartsLoadedForIncident: Boolean;

    private summaryPageError: string;
    private showSummaryPageError: Boolean;
    private readOnly: Boolean;
    private showEditButton: Boolean;
    private showTakeOwnershipButton: Boolean;
    private lockedByUser: string;

    constructor() {

        this.initialLoadOfPhotos = true;
        this.apiServer = "";
        this.redirectUrl = "";
        this.bodyPartsLoaded = false;
        this.isDirty = false;
        this.user = new User();
        this.injuryType = null;
        this.injuryReport = new InjuryReport();
        this.showSummaryPageError = false;
        this.summaryPageError = "";
        this.readOnly = false;     

        this.console("initialized session service");

    }

    public isProductionMode(): Boolean {
        return this.productionMode;
    }

    public setIsDirty(dirty: Boolean) {
        this.isDirty = dirty;
    }

    public getIsDirty(): Boolean {
        return this.isDirty;
    }

    public setShowEditButton(boolValue: Boolean) {
        this.showEditButton = boolValue;
    }

    public getShowEditButton(): Boolean {
        return this.showEditButton;
    }

    public setLockedByUser(userName: string) {
        this.lockedByUser = userName;
    }

    public getLockedByUser(): string {
        return this.lockedByUser;
    }

    public setTakeOwnershipButton(boolValue: Boolean) {
        this.showTakeOwnershipButton = boolValue;
    }

    public getShowTakeOwnershipButton(): Boolean {
        return this.showTakeOwnershipButton;
    }

    public setReadOnly(readOnly: Boolean) {
        this.readOnly = readOnly;
        this.console("readonly=" + this.readOnly);
    }

    public getReadOnly(): Boolean {
        return this.readOnly;
    }

    public setSummaryPageError(error: string) {
        this.summaryPageError = error;
    }

    public getSummaryPageError(): string {
        return this.summaryPageError;
    }

    public setShowSummaryPageError(error: Boolean) {
        this.showSummaryPageError = error;
    }

    public getShowSummaryPageError(): Boolean {
        return this.showSummaryPageError;
    }

    public setBodyPartsLoaded(bodyPartsLoaded: Boolean) {
        this.bodyPartsLoaded = bodyPartsLoaded;
    }

    public getBodyPartsLoaded(): Boolean {
        return this.bodyPartsLoaded;
    }

    public console(message: string) {
       if (this.productionMode == true) return false;
       console.log(message);

    }

    public setBodyPartsLoadedForIncident(bodyPartsLoaded: Boolean) {
        this.bodyPartsLoadedForIncident = bodyPartsLoaded;
    }

    public getBodyPartsLoadedForIncident(): Boolean {
        return this.bodyPartsLoadedForIncident;
    }

    public setFrontBodyParts(bodyParts: Array<BodyPart>) {
        this.frontBodyParts = bodyParts;
    }

    public getFrontBodyParts(): Array<BodyPart> {
        return this.frontBodyParts;
    }

    public setBackBodyParts(bodyParts: Array<BodyPart>) {
        this.backBodyParts = bodyParts;
    }

    public getBackBodyParts(): Array<BodyPart> {
        return this.backBodyParts;
    }

    public setInjuryTypes(bodyParts: Array<BodyPart>) {
        this.backBodyParts = bodyParts;
    }
    
    public setInitialLoadOfPhotos(initialLoad: Boolean) {
        this.initialLoadOfPhotos = initialLoad;
    }

    public getInitialLoadOfPhotos(): Boolean {
        return this.initialLoadOfPhotos;
    }

    public setSelectedIncidentReportString(incidentNumberString: string) {

        this.selectedIncidentReportNumberString = incidentNumberString;
    }

    public getSelectedIncidentReportString() {

        return this.selectedIncidentReportNumberString;
    }

    public setApiServer(apiServer: string) {

        this.apiServer = apiServer;
    }

    public getApiServer(): string {

        return this.apiServer;
    }

    public setRedirectUrl(redirectUrl: string) {

        this.redirectUrl = redirectUrl;
    }

    public getRedirectUrl(): string {

        return this.redirectUrl;
    }

    public setUser(user: User) {

        this.user = user;
    }

    public getUser(): User {

        return this.user;
    }

    public setInjuredEmployee(user: User) {

        this.injuredEmployee = user;
    }

    public getInjuredEmployee(): User {

        return this.injuredEmployee;
    }

    public setInjuryReport(injuryReport: InjuryReport) {

        this.injuryReport = injuryReport;
    }

    public getInjuryReport(): InjuryReport {

        return this.injuryReport;
    }

    public savePhotos(photos: Array<Photo>) {
        this.photos = photos;
    }

    public setPhotoIndex(index: number) {
        this.photoIndex = index;
    }

    public setInjuryType(injuryType: InjuryType) {
        this.injuryType = injuryType;
    }

    public getInjuryType(): InjuryType {
        return this.injuryType;
    }

    public getPhotos(): Array<Photo> {
        return this.photos;
    }


    public getOriginalPhotos(): Array<Photo> {
        return this.originalPhotos;
    }

    public setOriginalPhotos(photos: Array<Photo>) {
        this.originalPhotos = photos;
    }

    public getPhotoIndex(): number {
        return this.photoIndex;
    }

    public saveInjuryTypes(injuryTypes: Array<InjuryType>) {
        this.injuryTypes = injuryTypes;
    }

    public getInjuryTypes(): Array<InjuryType> {
        return this.injuryTypes;
    }


}