import { Injectable } from "@angular/core";
import { screen } from "platform";

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

    public getPadding(): number {
        let viewWidth = screen.mainScreen.widthDIPs;
        let padding: number = viewWidth * .10;
        return padding;
    }

}

