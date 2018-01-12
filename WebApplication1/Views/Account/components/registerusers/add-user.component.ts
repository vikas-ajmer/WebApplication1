import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ChallengeService } from '../../services/challenge.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/utilities";
import { Constants } from "../../services/Constants";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { AuthService } from "../../services/auth.service";
import { RegisterUsersService } from "../../services/registerusers.service"

@Component({
    selector: 'add-user.component-component',
    templateUrl: './add-user.component.html',
    styleUrls: ['./add-user.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AddUserComponent implements OnInit {
    usersList: any;
    filteredList: any[] = [];
    roleList: any[] = [];

    totalRecored: number;
    userRole: string;
    selectRole: any = "All";
    filterValue: any = '';
    userID: number;

    corporatesList: any[] = [];
    selectedCorporates: any[] = [];

    constructor(private registerUsersService: RegisterUsersService, private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService) {
        this.userID = parseInt(authService.currentUser.UserID);
        //this.corporatesList = [{ "CorporateInfoID": 0, "CorporateInfo_Name": "All Corporate" }];
        this.userRole = this.authService.currentUserRole;
    }

    ngOnInit() {
        setTimeout(() => { this.GetRoleList(); }, 50);
    }
    GetRoleList() {
        this.loadingService.showLoader(true);
        this.registerUsersService.UserRoleList().subscribe(
            res => {
                this.roleList = res.result;
                this.loadingService.showLoader(false);
                this.loadingService.showLoader(true);
                this.registerUsersService.GetCorporateList(this.userID).subscribe(
                    res => {
                        if (res.status == 1 || res.status == "1") {
                            res.result.forEach((el) => { this.corporatesList.push({ id: el.CorporateInfoID, itemName: el.CorporateInfo_Name }) });
                            //this.corporatesList = res.result;
                        }
                        else {
                            this.loadingService.showMessage("error", "Error in getting corporate list", MessageSeverity.error);
                        }
                        this.loadingService.showLoader(false);
                    },
                    error => {
                        if (Utilities.checkNoNetwork(error)) {
                            this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                            this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetUserList").subscribe(res => { }, error => { });
                        }
                        else {
                            let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                            this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                            this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetUserList").subscribe(res => { }, error => { });
                        }
                        this.loadingService.showLoader(false);
                    }
                )
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetUserList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetUserList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
}