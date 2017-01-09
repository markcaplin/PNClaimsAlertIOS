"use strict";
(function (BodyPartLocation) {
    BodyPartLocation[BodyPartLocation["Front"] = 1] = "Front";
    BodyPartLocation[BodyPartLocation["Back"] = 2] = "Back";
})(exports.BodyPartLocation || (exports.BodyPartLocation = {}));
var BodyPartLocation = exports.BodyPartLocation;
(function (InjuryReportStatus) {
    InjuryReportStatus[InjuryReportStatus["Incomplete"] = 1] = "Incomplete";
    InjuryReportStatus[InjuryReportStatus["SubmittedToEmployer"] = 2] = "SubmittedToEmployer";
    InjuryReportStatus[InjuryReportStatus["WillNotBeReported"] = 3] = "WillNotBeReported";
    InjuryReportStatus[InjuryReportStatus["Reported"] = 4] = "Reported";
    InjuryReportStatus[InjuryReportStatus["Cancelled"] = 5] = "Cancelled";
})(exports.InjuryReportStatus || (exports.InjuryReportStatus = {}));
var InjuryReportStatus = exports.InjuryReportStatus;
(function (Roles) {
    Roles[Roles["TechSupport"] = 1] = "TechSupport";
    Roles[Roles["EmployerAdmin"] = 2] = "EmployerAdmin";
    Roles[Roles["CarrierAdmin"] = 3] = "CarrierAdmin";
    Roles[Roles["Employee"] = 4] = "Employee";
})(exports.Roles || (exports.Roles = {}));
var Roles = exports.Roles;
(function (BatchImportTypes) {
    BatchImportTypes[BatchImportTypes["Employee"] = 1] = "Employee";
    BatchImportTypes[BatchImportTypes["Location"] = 2] = "Location";
})(exports.BatchImportTypes || (exports.BatchImportTypes = {}));
var BatchImportTypes = exports.BatchImportTypes;
(function (CompanyTypes) {
    CompanyTypes[CompanyTypes["All"] = 0] = "All";
    CompanyTypes[CompanyTypes["Administration"] = 1] = "Administration";
    CompanyTypes[CompanyTypes["Carrier"] = 2] = "Carrier";
    CompanyTypes[CompanyTypes["Employer"] = 3] = "Employer";
})(exports.CompanyTypes || (exports.CompanyTypes = {}));
var CompanyTypes = exports.CompanyTypes;
//# sourceMappingURL=enumerations.js.map