import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ChallengeService } from '../../services/challenge.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/utilities";
import { Constants } from "../../services/Constants";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { AuthService } from "../../services/auth.service";
import { RegisterUsersService } from "../../services/registerusers.service"

@Component({
    selector: 'users-list.component-component',
    templateUrl: './users-list.component.html',
    styleUrls: ['./users-list.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdminUsersComponent implements OnInit {
    usersList: any;
    filteredList: any[] = [];
    roleList: any[] = [];

    totalRecored: number;
    userRole: string;
    selectRole: any = "All";
    filterValue: any = '';

    constructor(private registerUsersService: RegisterUsersService, private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService) {
        this.userRole = this.authService.currentUserRole;
        this.roleList = [{ Role: "All", RoleID: "All" }];
    }
    
    ngOnInit() {
        setTimeout(() => { this.GetRoleList(); }, 50);        
    }
    GetRoleList() {
        this.loadingService.showLoader(true);
        this.registerUsersService.UserRoleList().subscribe(
            res => {
                this.roleList=res.result;
                this.loadingService.showLoader(false);
                this.GetUserList();
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
    GetUserList() {
        this.loadingService.showLoader(true);
        this.registerUsersService.UserList().subscribe(
            res => {
                this.usersList = res.result;
                this.filteredList = res.result;
                //this.userList = res.Data;
                //this.totalRecored = res.TotalRecored;
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
            });
    }
    FilterUser(roleName: any) {
        this.filterValue =  roleName != "All" ? roleName: '';
        this.selectRole = roleName;
    }
}