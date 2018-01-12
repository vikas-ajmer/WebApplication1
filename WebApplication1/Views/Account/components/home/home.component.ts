import { Component, OnInit } from '@angular/core';
import { DashboardService } from "../../services/dashboard.service";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { ErrorLogService } from "../../services/error.log.service";

import {
    DashboardUser,
    Dashboard_CorporateUser,
    Dashboard_DietitianChat,
    Dashboard_OnlineUser,
    Dashboard_Statistics
} from "../../models/dashboard-users-model";

import { CorporateInfo } from "../../models/corporate.model";

import { Constants } from "../../services/constants";
import { Utilities } from '../../services/Utilities';
import { AuthService } from "../../services/auth.service";
import { TypeaheadMatch } from "ngx-bootstrap";

@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: []
})

export class HomeComponent implements OnInit {
    isShowCounter: boolean = false;
    corporateDropdown:any;
    public statistics: Dashboard_Statistics;
    public onlineUsers: Dashboard_OnlineUser;
    public corporateUsers: Array<Dashboard_CorporateUser>;
    public corporateInfo: Array<CorporateInfo>;
    currentUser: any;
    constructor(private dashboardService: DashboardService, public authService: AuthService, private loadingService: LoadingService, private errorLog: ErrorLogService) {
        this.statistics = new Dashboard_Statistics();
        this.onlineUsers = new Dashboard_OnlineUser();
        this.corporateUsers = new Array<Dashboard_CorporateUser>();
        this.currentUser = authService.currentUser;
    }

    ngOnInit(): void {
        setTimeout(() => {
            this.getDashboardValues(parseInt(this.currentUser.CorporateinfoID), parseInt(this.currentUser.UserID));
            this.getUserCorporates(this.currentUser.RoleID, this.currentUser.MemberID, this.currentUser.UserID);
        }, 100);
    }

    getDashboardValues(corporateID: number, userID: number) {
        this.loadingService.showLoader(true);
        this.dashboardService.getDashboardValues(corporateID, userID).subscribe((res: DashboardUser) => {
            this.statistics = res.statistics;
            this.onlineUsers = res.onlineUsers;
            this.corporateUsers = res.CorporateUsers;
            setTimeout(() => {
                this.isShowCounter = true;
            }, 10);
            this.loadingService.showLoader(false);
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getDashboardValues").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getDashboardValues").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    getUserCorporates(roleID: any, memberID: any, userID: any) {
        this.dashboardService.getUserCorporates(roleID, memberID, userID).subscribe((res: any) => {
            this.corporateInfo = res;
        }, error => {
            if (Utilities.checkNoNetwork(error)) {
                this.loadingService.showMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error);
                this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getUserCorporates").subscribe(res => { }, error => { });
            }
            else {
                let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getUserCorporates").subscribe(res => { }, error => { });
            }
        });
    }

    onSelectCorporateDropdown(e: TypeaheadMatch): void {
        let corporateID = e.item.CorporateInfoID;
        this.getDashboardValues(corporateID, parseInt(this.currentUser.UserID));
    }

    onCorporateDropdownNoResults(e: any): void {
        let corporateDropdownValue = (document.getElementById("corporateSearchInput") as HTMLInputElement).value;
        if (corporateDropdownValue.trim().length <= 0) {
            this.getDashboardValues(parseInt(this.currentUser.CorporateinfoID), parseInt(this.currentUser.UserID));
        }
    }
}
