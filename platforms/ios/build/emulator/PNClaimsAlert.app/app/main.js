// this import should be first in order to load some required settings (like globals and reflect-metadata)
"use strict";
require("reflect-metadata");
var application_1 = require("nativescript-angular/application");
var app_component_1 = require("./app.component");
var app_routes_1 = require("./app.routes");
var core_1 = require('@angular/core');
var parse5_adapter_1 = require('@angular/platform-server/src/parse5_adapter');
parse5_adapter_1.Parse5DomAdapter.prototype.getCookie = function (name) { return null; };
core_1.enableProdMode();
application_1.nativeScriptBootstrap(app_component_1.AppComponent, app_routes_1.APP_ROUTER_PROVIDERS);
//# sourceMappingURL=main.js.map