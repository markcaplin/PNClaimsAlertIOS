"use strict";
var core_1 = require("@angular/core");
var session_service_1 = require("../services/session.service");
var HelperService = (function () {
    function HelperService(_sessionService) {
        this._sessionService = _sessionService;
    }
    HelperService.prototype.convertJsonDateToJavaScriptDate = function (inputDate) {
        var emptyDate = "0000-00-00T00:00:00";
        var jsonDateLength = emptyDate.length;
        var realDate;
        if (inputDate == null)
            return "";
        try {
            var newDate = inputDate.toString();
            if (newDate.length == jsonDateLength) {
                var month = newDate.substr(5, 2);
                var day = newDate.substr(8, 2);
                var year = newDate.substr(0, 4);
                var stringDate = month + "/" + day + "/" + year;
                if (stringDate == "01/01/0001")
                    return "";
                realDate = new Date(stringDate);
            }
            else {
                var month = inputDate.getMonth() + 1;
                var day = inputDate.getDate();
                var year = inputDate.getFullYear();
                var stringDate = month + "/" + day + "/" + year;
                if (stringDate == "01/01/0001")
                    return "";
                realDate = new Date(stringDate);
            }
        }
        catch (err) {
            this._sessionService.console("invalid date " + inputDate);
        }
        return realDate;
    };
    HelperService.prototype.formatDate = function (inputDate) {
        var formattedDate = "";
        if (inputDate == null || inputDate == undefined)
            return "";
        var testDate = inputDate.toString();
        if (testDate.length == 0)
            return "";
        try {
            var tempDate = new Date(inputDate.toString());
            var month = tempDate.getMonth() + 1;
            var day = tempDate.getDate();
            var year = tempDate.getFullYear();
            var formattedMonth = month.toString();
            var formattedDay = day.toString();
            var formattedYear = year.toString();
            if (month < 10) {
                formattedMonth = "0" + formattedMonth;
            }
            if (day < 10) {
                formattedDay = "0" + formattedDay;
            }
            formattedDate = formattedMonth + "/" + formattedDay + "/" + formattedYear;
            if (formattedDate == "01/01/1901")
                formattedDate = "";
        }
        catch (err) {
            this._sessionService.console("invalid date " + inputDate);
        }
        return formattedDate;
    };
    HelperService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [session_service_1.SessionService])
    ], HelperService);
    return HelperService;
}());
exports.HelperService = HelperService;
//# sourceMappingURL=helper.service.js.map