"use strict";
var core_1 = require("@angular/core");
var platform_1 = require("platform");
var SettingsService = (function () {
    function SettingsService() {
        this.transitionName = "fade";
        this.transitionDuration = 2000;
        this.transitionCurve = "linear";
        this.transitionSlideRight = "fade";
    }
    SettingsService.prototype.getPadding = function () {
        var viewWidth = platform_1.screen.mainScreen.widthDIPs;
        var padding = viewWidth * .10;
        return padding;
    };
    SettingsService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], SettingsService);
    return SettingsService;
}());
exports.SettingsService = SettingsService;
//# sourceMappingURL=settings.service.js.map