// this import should be first in order to load some required settings (like globals and reflect-metadata)

import "reflect-metadata";
import { nativeScriptBootstrap } from "nativescript-angular/application";
import { AppComponent } from "./app.component";

import { APP_ROUTER_PROVIDERS } from "./app.routes";
import { enableProdMode } from '@angular/core';
import { Parse5DomAdapter } from '@angular/platform-server/src/parse5_adapter';

(<any>Parse5DomAdapter).prototype.getCookie = function (name) { return null; };

enableProdMode();

nativeScriptBootstrap(AppComponent, APP_ROUTER_PROVIDERS);


