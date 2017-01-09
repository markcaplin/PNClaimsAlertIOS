"use strict";
var core_1 = require("@angular/core");
var SettingsService = (function () {
    function SettingsService() {
        this.transitionName = "fade";
        this.transitionDuration = 2000;
        this.transitionCurve = "linear";
        this.transitionSlideRight = "fade";
    }
    SettingsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SettingsService);
    return SettingsService;
}());
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map