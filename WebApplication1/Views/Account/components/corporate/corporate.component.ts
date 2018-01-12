import { Component, OnInit, ViewEncapsulation  } from '@angular/core';

import { CorporateService } from '../../services/corporate.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/Utilities";
import { Constants } from "../../services/constants";
import { LoadingService, MessageSeverity } from "../../services/loader.service";

@Component({
    selector: 'corporate',
    templateUrl: './corporate.component.html',
    styleUrls: ['./corporate.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class CorporateComponent implements OnInit {

    corporateList: any;
    recoredPerPage: number = 10;
    currentPage: number = 1;
    totalRecored: number = 0;
    searchTerm: string = "";
    sortBy: string = "name";
    sortOrder: string = "ASC";

    constructor(private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService) {
    }

    ngOnInit() {
        setTimeout(() => {
            this.getCorporateList();
        }, 100);
    }

    getCorporateList() {
        this.loadingService.showLoader(true);
        this.corporateService.corporateList(this.currentPage, this.recoredPerPage, this.searchTerm, this.sortBy, this.sortOrder).subscribe(
            res => {
                this.corporateList = res.Data;
                this.totalRecored = res.TotalRecored;
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getCorporateList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getCorporateList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    onSearchChanged(value: string) {
        this.searchTerm = value;
        this.currentPage = 1;
        this.getCorporateList();
    }

    onRecoredChanged(value: string) {
        this.currentPage = 1;
        this.recoredPerPage = +value;
        this.getCorporateList();
    }

    GetCurrentPageRecored(event: any): void {
        this.currentPage = event.page;
        this.getCorporateList();
    }

    GetSortOrder(sortBy: string) {
        this.sortBy = sortBy;
        this.sortOrder = this.sortOrder == "ASC" ? "DESC" : "ASC";
        this.getCorporateList();
    }
}
