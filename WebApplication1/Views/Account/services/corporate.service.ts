import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from './constants';
import { CorporateBasicDetails, CorporateFeaturs } from '../models/corporate.model';

@Injectable()
export class CorporateService {
    private _step = new Subject<string>();
    private corporate: any;
    private IsCorporateEdit: boolean = false;
    private IsCorporateEmpAdd: boolean = false;
    private IsCorporateEmpDel: boolean = false;
    constructor(protected http: Http) {

    }

    corporateList(currentPage: number, recoredPerPage: number, searchTerm: string, sortBy: string, sortOrder: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/ListCorporate", { PageIndex: currentPage, PageSize: recoredPerPage, SearchTerm: searchTerm, ShortBy: sortBy, ShortOrder: sortOrder })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    GetCorporateInfoById(corporateInfoID: number, userID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/GetCorporateInfoById", { corporateInfoID: corporateInfoID, UserID: userID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    GetCorporateLeaderBoard(corporateInfoID: number, currentPage: number, recoredPerPage: number, searchTerm: string, sortBy: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/GetCorporateLeaderboard", { corporateInfoID: corporateInfoID, PageIndex: currentPage, PageSize: recoredPerPage, SearchTerm: searchTerm, ShortBy: sortBy })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    addCorporateBasicDetails(corporateBasicDetails: CorporateBasicDetails): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/AddNewCorporate", corporateBasicDetails)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getHealthExperts(): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/GetHealthExperts", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getCorporateBasicDetails(corporateInfoID: any): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/GetAdminCorporateInfo", { corporateInfoID: corporateInfoID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    getCorporatePackageList(): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/GetCorporatePackageList", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getCorporateAddOnFeature(corporateInfoID: any): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/GetCorporateAddOnFeature", { corporateInfoID: corporateInfoID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getTotalAndLimitByCorporateInfoId(CorporateinfoID: any): Observable<any> {
        return this.http.post(Constants.API_URL + "values/GetTotalAndLimitByCorporateInfoId", { corporateInfoID: CorporateinfoID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    SaveCorporateAddOnFeature(corporateFeaturs: CorporateFeaturs): Observable<any> {
        return this.http.post(Constants.API_URL + "Corporate/SaveCorporateAddOnFeature", corporateFeaturs)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveImportUser(selectedFiles: any, CorporateinfoID: any, data: any = null): Observable<any> {
        return this.http.post(Constants.API_URL + "values/AddMemberImport", { file: selectedFiles, CorporateinfoID: CorporateinfoID, ApplicationID: 2, data: data })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    RemoveImportUser(selectedFiles: any, CorporateinfoID: any, data: any = null): Observable<any> {
        return this.http.post(Constants.API_URL + "values/RemoveMemberImport", { file: selectedFiles, CorporateinfoID: CorporateinfoID, ApplicationID: 2, data: data })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SendMailToImportUser(templateText: any, emailSubject: any, emailIds: any, nameToDisplay: any, selectCorporate: any, memberId: any, corporateId: any): Observable<any> {
        return this.http.post(Constants.API_URL + "SendEmailTeamplate/SendEmails", { templatetext: templateText, emailSubject: emailSubject, emailids: emailIds, nameToDisplay: nameToDisplay, selectcorporate: selectCorporate, memberId: memberId, corporateId: corporateId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    setNewCorporate(val: any): void {
        this.corporate = val;
    }
    getNewCorporate(): any {
        return this.corporate;
    }
    setCorporateIsEdit(val: boolean): void {
        this.IsCorporateEdit = val;
        this.IsCorporateEmpDel = false;
        this.IsCorporateEmpAdd = false;
    }
    getCorporateIsEdit(): boolean {
        return this.IsCorporateEdit;
    }
    setCorporateIsEmpAdd(val: boolean): void {
        this.IsCorporateEmpAdd = val;
        this.IsCorporateEdit = false;
        this.IsCorporateEmpDel = false;
    }
    getCorporateIsEmpAdd(): boolean {
        return this.IsCorporateEmpAdd;
    }
    setCorporateIsEmpDel(val: boolean): void {
        this.IsCorporateEmpDel = val;
        this.IsCorporateEdit = false;
        this.IsCorporateEmpAdd = false;
    }
    getCorporateIsEmpDel(): boolean {
        return this.IsCorporateEmpDel;
    }
    getStep(val: string): void {
        this._step.next(val);
    }
    notify(): Observable<string> {
        return this._step.asObservable();
    }
}