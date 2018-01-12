import { Injectable, Injector } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Constants } from './Constants';

@Injectable()
export class ReportService {
    constructor(protected http: Http) {
    }
    GetStaticCorporateReport(fromDate: Date, toDate: Date): Observable<any> {
        return this.http.post(Constants.API_URL + "Values/GetStaticReport", { startDate: fromDate, endDate: toDate })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
}