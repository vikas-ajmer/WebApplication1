import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Constants } from './constants';

@Injectable()
export class UserService {

    constructor(protected http: Http) {

    }

    usersList(corporateId: number, searchFor: number, filterBy: any): Observable<any> {
        return this.http.post(Constants.API_URL + "ManageUser/GlobelSearch",
            {
                SearchFor: searchFor,
                corporateInfoID: corporateId,
                PageIndex: filterBy.currentPage,
                PageSize: filterBy.recoredPerPage,
                SearchTerm: filterBy.searchTerm,
                ShortBy: filterBy.sortBy,
                ShortOrder: filterBy.sortOrder,
                Name: filterBy.Name
            })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
}