"use strict";
var router_1 = require("nativescript-angular/router");
var login_component_1 = require("./account/login.component");
var injured_employee_component_1 = require("./injuryReport/injured-employee.component");
var search_employees_component_1 = require("./injuryReport/search-employees.component");
var incident_date_picker_component_1 = require("./injuryReport/incident-date-picker.component");
var body_part_picker_component_1 = require("./injuryReport/body-part-picker.component");
var take_a_picture_component_1 = require("./injuryReport/take-a-picture.component");
var picture_detail_component_1 = require("./injuryReport/picture-detail.component");
var additional_questions_component_1 = require("./injuryReport/additional-questions.component");
var select_injury_type_component_1 = require("./injuryReport/select-injury-type.component");
var confirmation_summary_component_1 = require("./injuryReport/confirmation-summary.component");
var injury_reports_component_1 = require("./injuryReport/injury-reports.component");
var thank_you_component_1 = require("./injuryReport/thank-you.component");
exports.routes = [
    { path: "", component: login_component_1.LoginComponent },
    { path: "account/login", component: login_component_1.LoginComponent },
    { path: "injuryreport/injuredemployee", component: injured_employee_component_1.InjuredEmployeeComponent },
    { path: "injuryreport/searchemployees", component: search_employees_component_1.SearchEmployeesComponent },
    { path: "injuryreport/datepicker", component: incident_date_picker_component_1.IncidentDatePickerComponent },
    { path: "injuryreport/bodypartpicker", component: body_part_picker_component_1.BodyPartPickerComponent },
    { path: "injuryreport/takepicture", component: take_a_picture_component_1.TakePictureComponent },
    { path: "injuryreport/picturedetail", component: picture_detail_component_1.PictureDetailComponent },
    { path: "injuryreport/additionalquestions", component: additional_questions_component_1.AdditionalQuestionsComponent },
    { path: "injuryreport/selectinjurytype", component: select_injury_type_component_1.SelectInjuryTypeComponent },
    { path: "injuryreport/confirmationsummary", component: confirmation_summary_component_1.ConfirmationSummaryComponent },
    { path: "injuryreport/injuryreports", component: injury_reports_component_1.InjuryReportsComponent },
    { path: "injuryreport/thankyou", component: thank_you_component_1.ThankYouComponent }
];
exports.APP_ROUTER_PROVIDERS = [
    router_1.nsProvideRouter(exports.routes, {})
];
//# sourceMappingURL=app.routes.js.map