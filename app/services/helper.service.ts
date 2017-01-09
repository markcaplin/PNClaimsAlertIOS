import { Injectable } from "@angular/core";
import { SessionService } from "../services/session.service";

@Injectable()
export class HelperService {
   
    constructor(private _sessionService: SessionService) {}

    public convertJsonDateToJavaScriptDate(inputDate: Date): any {
      
        let emptyDate = "0000-00-00T00:00:00";
        let jsonDateLength = emptyDate.length;

        let realDate;

        if (inputDate == null) return "";

        try {

            let newDate = inputDate.toString();
            if (newDate.length == jsonDateLength) {

                let month = newDate.substr(5, 2);
                let day = newDate.substr(8, 2);
                let year = newDate.substr(0, 4);
                let stringDate = month + "/" + day + "/" + year;

                if (stringDate == "01/01/0001") return "";

                realDate = new Date(stringDate);
            }
            else {
                
                let month = inputDate.getMonth() + 1;
                let day = inputDate.getDate();
                let year = inputDate.getFullYear();

                let stringDate = month + "/" + day + "/" + year;
                if (stringDate == "01/01/0001") return "";
              
                realDate = new Date(stringDate);
            
            }
        }
        catch (err) {
           this._sessionService.console("invalid date " + inputDate);
        }

        return realDate;

    }

    public formatDate(inputDate: Date): any {

        let formattedDate = "";
  
        if (inputDate == null || inputDate == undefined) return "";

        let testDate = inputDate.toString();
        if (testDate.length == 0) return "";

        try {
          
            let tempDate = new Date(inputDate.toString());

            let month = tempDate.getMonth() + 1;
            let day = tempDate.getDate();
            let year = tempDate.getFullYear();

            let formattedMonth = month.toString();
            let formattedDay = day.toString();
            let formattedYear = year.toString();

            if (month < 10) {
                formattedMonth = "0" + formattedMonth;
            }

            if (day < 10) {
                formattedDay = "0" + formattedDay;
            }

            formattedDate = formattedMonth + "/" + formattedDay + "/" + formattedYear;
            if (formattedDate == "01/01/1901") formattedDate = "";
        }
        catch (err) {
           this._sessionService.console("invalid date " + inputDate);
        }

        return formattedDate;

    }

}