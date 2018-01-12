import { Injectable, Injector } from '@angular/core';
import { Router } from "@angular/router";
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';

@Injectable()
export class ErrorLogService {

    constructor(private router: Router, protected http: Http) {
    }

    WriteError(errorMsg: string, errorMethod: string): Observable<any> {
        return this.http.post("/home/SaveErrorLog", { ErrorMsg: errorMsg, ErrorMethod: errorMethod, Path: this.router.url })
            .map((response: any) => {
                return response;
            })
            .catch(error => {
                return error;
            });
    }
}