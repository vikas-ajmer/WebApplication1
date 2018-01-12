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
import { User } from '../models/user.model';

@Injectable()
export class AuthService {

    public get loginUrl() { return "/login"; }
    public get homeUrl() { return "/home"; }

    public loginRedirectUrl: string;
    public logoutRedirectUrl: string;
    private _loginStatus = new Subject<boolean>();
    private previousIsLoggedInCheck = false;


    constructor(private router: Router, protected http: Http, private localStorage: LocalStoreManager) {
        this.initializeLoginStatus();
    }

    private initializeLoginStatus() {
        this.localStorage.getInitEvent().subscribe(() => {
            this.reevaluateLoginStatus();
        });
    }

    private reevaluateLoginStatus(currentUser?: User) {

        let user = currentUser || this.localStorage.getDataObject<User>(Constants.CURRENT_USER);
        let isLoggedIn = user != null;

        if (this.previousIsLoggedInCheck != isLoggedIn) {
            setTimeout(() => {
                this._loginStatus.next(isLoggedIn);
            });
        }

        this.previousIsLoggedInCheck = isLoggedIn;
    }

    redirectLoginUser() {
        let redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != Utilities.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
        this.loginRedirectUrl = "";


        let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
        let urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

        let navigationExtras: NavigationExtras = {
            fragment: urlParamsAndFragment.secondPart,
            queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
            queryParamsHandling: "merge"
        };

        this.router.navigate([urlAndParams.firstPart], navigationExtras);
    }
    redirectLogoutUser() {
        let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
        this.logoutRedirectUrl = "";

        this.router.navigate([redirect]);
    }
    getLoginStatusEvent(): Observable<boolean> {
        return this._loginStatus.asObservable();
    }

    login(userName: string, password: string, rememberMe: boolean): Observable<any> {

        return this.http.post(Constants.API_URL + "values/login", { UserId: userName, Password: password })
            .map((response: any) => {
                return this.processLoginResponse(response, rememberMe)
            })
            .catch(error => {
                return error;
            });
    }

    private processLoginResponse(response: Response, rememberMe: boolean) {

        let result = response.json();
        let user = new User(
            result.memberinfo.ApplicationID,
            result.memberinfo.CorpoarteImage,
            result.memberinfo.CorporateName,
            result.memberinfo.CorporateinfoID,
            result.memberinfo.MemberID,
            result.memberinfo.RoleID,
            result.memberinfo.UserID,
            result.corpoarteimage,
            result.memberinfo.FullName
        );
        if (user.MemberID != "0" && user.MemberID != null)
            this.saveUserDetails(user, rememberMe);
        return user;
    }

    private saveUserDetails(user: User, rememberMe: boolean) {

        if (rememberMe) {
            this.localStorage.savePermanentData(Utilities.EncryptData(user), Constants.CURRENT_USER);
        }
        else {
            this.localStorage.savePermanentData(Utilities.EncryptData(user), Constants.CURRENT_USER);
            //this.localStorage.saveSyncedSessionData(Utilities.EncryptData(user), Constants.CURRENT_USER);
        }
        this.reevaluateLoginStatus(user);

        this.localStorage.savePermanentData(rememberMe, Constants.REMEMBER_ME);
    }

    logout(): void {
        this.localStorage.deleteData(Constants.CURRENT_USER);
        this.reevaluateLoginStatus();
    }

    get currentUser(): User {
        let user = this.localStorage.getDataObject<User>(Constants.CURRENT_USER);
        return user;
    }

    get isLoggedIn(): boolean {
        return this.currentUser != null;
    }

    get currentUserRole(): any {
        return Utilities.GetuserRoleByRoleId(this.currentUser.RoleID);
    }

    get rememberMe(): boolean {
        return this.localStorage.getDataObject<boolean>(Constants.REMEMBER_ME) == true;
    }
    get currentUserId(): any {
        return this.currentUser.MemberID;
    }
}