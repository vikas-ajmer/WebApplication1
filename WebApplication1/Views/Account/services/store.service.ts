import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from './constants';
import { OrderList } from "../models/store.model";

@Injectable()
export class StoreService {

    constructor(protected http: Http) {

    }

    getCorporatesList(userCorporateID: number): Observable<any[]> {
        return this.http.post(Constants.API_URL + "EngagementReport/GetCorporateName", { UserCorporateID: userCorporateID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getOrderList(orderList:OrderList): Observable<any> {
        return this.http.post(Constants.API_URL + "Store/GetOrderList", orderList)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getOrderInvoiceDetail(orderList: OrderList): Observable<any> {
        return this.http.post(Constants.API_URL + "Store/GetOrderInvoice", orderList)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    
}