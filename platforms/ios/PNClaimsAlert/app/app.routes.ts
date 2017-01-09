import { RouterConfig } from "@angular/router";
import { nsProvideRouter } from "nativescript-angular/router"
import { LoginComponent } from "./account/login.component";
import { InjuredEmployeeComponent } from "./injuryReport/injured-employee.component";
import { SearchEmployeesComponent } from "./injuryReport/search-employees.component";
import { IncidentDatePickerComponent } from "./injuryReport/incident-date-picker.component";
import { BodyPartPickerComponent } from "./injuryReport/body-part-picker.component";
import { TakePictureComponent } from "./injuryReport/take-a-picture.component";
import { PictureDetailComponent } from "./injuryReport/picture-detail.component";
import { AdditionalQuestionsComponent } from "./injuryReport/additional-questions.component";
import { SelectInjuryTypeComponent } from "./injuryReport/select-injury-type.component";
import { ConfirmationSummaryComponent } from "./injuryReport/confirmation-summary.component";
import { InjuryReportsComponent } from "./injuryReport/injury-reports.component";
import { ThankYouComponent } from "./injuryReport/thank-you.component";

export const routes: RouterConfig = [
    { path: "", component: LoginComponent },
    { path: "account/login", component: LoginComponent },
    { path: "injuryreport/injuredemployee", component: InjuredEmployeeComponent },
    { path: "injuryreport/searchemployees", component: SearchEmployeesComponent },
    { path: "injuryreport/datepicker", component: IncidentDatePickerComponent },
    { path: "injuryreport/bodypartpicker", component: BodyPartPickerComponent },
    { path: "injuryreport/takepicture", component: TakePictureComponent },
    { path: "injuryreport/picturedetail", component: PictureDetailComponent },
    { path: "injuryreport/additionalquestions", component: AdditionalQuestionsComponent },
    { path: "injuryreport/selectinjurytype", component: SelectInjuryTypeComponent },
    { path: "injuryreport/confirmationsummary", component: ConfirmationSummaryComponent },
    { path: "injuryreport/injuryreports", component: InjuryReportsComponent },
    { path: "injuryreport/thankyou", component: ThankYouComponent }
]

export const APP_ROUTER_PROVIDERS = [
    nsProvideRouter(routes, {})
];


