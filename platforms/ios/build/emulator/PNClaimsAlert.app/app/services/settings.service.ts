import { Injectable } from "@angular/core";

@Injectable()
export class SettingsService {


    public transitionName;
    public transitionDuration;
    public transitionCurve;
    public transitionSlideRight;
         
    constructor() {

        this.transitionName = "fade";
        this.transitionDuration = 2000;
        this.transitionCurve = "linear";
        this.transitionSlideRight = "fade";
       
    }

}

