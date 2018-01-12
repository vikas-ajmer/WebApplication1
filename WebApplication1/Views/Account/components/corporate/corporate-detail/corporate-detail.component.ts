import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CorporateService } from '../../../services/corporate.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { AuthService } from "../../../services/auth.service";

@Component({
    selector: 'corporate-detail',
    templateUrl: './corporate-detail.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class CorporateDetailComponent implements OnInit {
    corporateInfoId: number = 0;
    recoredPerPage: number = 10;
    currentPage: number = 1;
    totalRecored: number = 0;
    searchTerm: string = "";
    sortBy: string = "peps";
    currentUserId: any = 0;
    corporateDetail: any = {};
    corporateLeaderBoard: any = [];
    isShowCounter: boolean = false;
    isUserOverLimit: boolean = false;
    isCorporateExpire: boolean = false;
    constructor(private route: ActivatedRoute, private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService, public authService: AuthService) {
        let id = this.route.snapshot.paramMap.get('id');
        if (id != null)
            this.corporateInfoId = +id;
        this.currentUserId = authService.currentUserId;
    }

    ngOnInit() {
        setTimeout(() => {
            this.getCorporateLeaderBoard();
        }, 10);
        setTimeout(() => {
            this.getCorporateInfo();
        }, 500);
    }

    getCorporateInfo() {
        //this.loadingService.showLoader(true);
        this.corporateService.GetCorporateInfoById(this.corporateInfoId, this.currentUserId).subscribe(
            res => {
                this.corporateDetail = res.result;
                setTimeout(() => {
                    this.isShowCounter = true;
                }, 10);
                // this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getCorporateInfo").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getCorporateInfo").subscribe(res => { }, error => { });
                }
                // this.loadingService.showLoader(false);
            });
    }
    getCorporateLeaderBoard() {
        this.loadingService.showLoader(true);
        this.corporateService.GetCorporateLeaderBoard(this.corporateInfoId, this.currentPage, this.recoredPerPage, this.searchTerm, this.sortBy).subscribe(
            res => {
                this.corporateLeaderBoard = res.Data;
                this.totalRecored = res.TotalRecored;
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getCorporateLeaderBoard").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getCorporateLeaderBoard").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    SortCorporateLeaderBoard(sortBy: string) {
        this.sortBy = sortBy;
        this.getCorporateLeaderBoard();
    }
    onSearchChanged(value: string) {
        this.searchTerm = value;
        this.currentPage = 1;
        this.getCorporateLeaderBoard();
    }

    onRecoredChanged(value: string) {
        this.currentPage = 1;
        this.recoredPerPage = +value;
        this.getCorporateLeaderBoard();
    }
    GetCurrentPageRecored(event: any): void {
        this.currentPage = event.page;
        this.getCorporateLeaderBoard();
    }
}
