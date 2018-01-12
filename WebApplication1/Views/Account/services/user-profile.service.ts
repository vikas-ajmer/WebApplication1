import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Constants } from './constants';

@Injectable()
export class UserProfileService {

    constructor(protected http: Http) {
    }

    getUserProfileByMemberID(memberID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/UserProfile",
            {
                MemberID: memberID
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getMemberSteps(memberID: number, filterBy: any): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/Admin_GetMemberSteps",
            {
                MemberID: memberID,
                PageIndex:filterBy.currentPage,
                PageSize: filterBy.recoredPerPage,
                SearchTerm: filterBy.searchTerm,
                ShortBy: filterBy.sortBy,
                ShortOrder: filterBy.sortOrder
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getMemberPrograms(memberID: number, filterBy: any): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/GetMemberPrograms",
            {
                MemberID: memberID,
                PageIndex: filterBy.currentPage,
                PageSize: filterBy.recoredPerPage,
                SearchTerm: filterBy.searchTerm,
                ShortBy: filterBy.sortBy,
                ShortOrder: filterBy.sortOrder
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getMemberChallenges(memberID: number, filterBy: any): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/GetMemberChallenges",
            {
                MemberID: memberID,
                PageIndex: filterBy.currentPage,
                PageSize: filterBy.recoredPerPage,
                SearchTerm: filterBy.searchTerm,
                ShortBy: filterBy.sortBy,
                ShortOrder: filterBy.sortOrder
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getMemberPointsStatement(memberID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/GetMemberPointsStatement",
            {
                MemberID: memberID
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getMemberPointsStatement_Monthly(memberID: number, date: any): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/GetMemberPointsStatement_Monthly",
            {
                MemberID: memberID,
                Date: date
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
}