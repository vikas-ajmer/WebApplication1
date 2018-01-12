import { Injectable, Injector } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

import { LocalStoreManager } from './local-store-manager.service';
import { Utilities } from './Utilities';
import { Constants } from './constants';
import { DashboardUser } from '../models/dashboard-users-model';

@Injectable()
export class DashboardService {

    constructor(private router: Router, protected http: Http, private localStorage: LocalStoreManager) {

    }

    getDashboardValues(corporateID: number, userID: number): Observable<DashboardUser> {
        return this.http.post(Constants.API_URL + "values/GetDashboardData", { CorporateId: corporateID, UserID: userID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getUserCorporates(RoleId: string, memberId: string, corporateId: string): Observable<any> {
        return this.http.post(Constants.API_URL + "EngagementReport/GetCorporateName",
            {
                CorporateRoleID: RoleId, MemberID: memberId, UserCorporateID: corporateId
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
}