import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Constants } from './Constants';

import { UsersList } from '../models/adminuser.model'

@Injectable()
export class RegisterUsersService {
    private individualChallenge: any;
    private tamChallenge: any;
    private _step = new Subject<string>();
    constructor(protected http: Http) {

    }
    UserList(): Observable<any> {
        return this.http.post(Constants.API_URL + "Login/ListUser", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    UserRoleList(): Observable<any> {
        return this.http.post(Constants.API_URL + "Login/GetRoleList", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetCorporateList(userCorporateID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "EngagementReport/GetCorporateName", { UserCorporateID: userCorporateID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
}