import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
@Injectable()
export class Constants {
    public static readonly CURRENT_USER = "current_user";
    public static readonly REMEMBER_ME = "remember_me";
    //http://demo.truworth.net/TWCCorporateAdminV2/api/
    public static readonly API_URL = "http://localhost:62415/api/";
    public static readonly ERROR_MSG = "Oops! There is something wrong in the middle of the process. Please try again later.";
    public static readonly CRYPTO_SECRET_KEY = "A1B2C3D4E5F6G7H8I9J10";
    constructor() { }
}