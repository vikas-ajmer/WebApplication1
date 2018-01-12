import { Component, OnInit } from '@angular/core';

//service
import { UserService } from '../../services/user.service';
import { ErrorLogService } from "../../services/error.log.service";
import { AuthService } from "../../services/auth.service";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
//service

//model
import { UserListModel } from "../../models/user-list.model";
//model

import { Utilities } from "../../services/Utilities";
import { Constants } from "../../services/constants";

@Component({
    selector: 'user-component',
    templateUrl: './user.component.html',
    styleUrls: []
})

export class UserComponent implements OnInit {

    public usersList: Array<UserListModel>;
    public searchInputCorpEmpID: string="";
    public searchInputEmailName: string="";

    public recoredPerPage: number = 10;
    public currentPage: number = 1;
    public totalRecord: number = 0;
    public searchTerm: string = "";
    public sortBy: string = "corporate_name";
    public sortOrder: string = "ASC";
    public IsShowFilterBox = false;

    constructor(private userService: UserService, private errorLog: ErrorLogService, private authService: AuthService, private loadingService: LoadingService) {
        this.usersList = new Array<UserListModel>();
    }

    ngOnInit() {
        let $this = this;
        let filterBy: any = {
            recoredPerPage: 10,
            currentPage: 1,
            totalRecord: 0,
            searchTerm: "",
            sortBy: "corporate_name",
            sortOrder: "ASC",
            Name: this.searchInputEmailName
        }

        let currentUser = this.authService.currentUser;
        setTimeout(() => {
            $this.getUsersList(parseInt(currentUser.CorporateinfoID), 1, filterBy);
        }, 100);
    }

    getUsersList(corporateInfoID: number, SearchFor: number, filterBy: any) {
        this.loadingService.showLoader(true);
        this.userService.usersList(corporateInfoID, SearchFor, filterBy).subscribe((res: Array<UserListModel>) => {
            this.usersList = res;
            if (res.length > 0) {
                this.totalRecord = res[0].TotalCount;
            }
            this.loadingService.showLoader(false);

        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getUsersList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getUsersList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    onSearchChanged(value: string) {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPage,
            currentPage: 1,
            totalRecord: this.totalRecord,
            searchTerm: this.searchInputCorpEmpID,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder == "ASC" ? "DESC" : "ASC",
            Name: this.searchInputEmailName
        }

        let currentUser = this.authService.currentUser;
        this.getUsersList(parseInt(currentUser.CorporateinfoID), 1, filterBy);
    }

    onRecoredSelect(value: string) {
        let filterBy: any = {
            recoredPerPage: +value,
            currentPage: 1,
            totalRecord: this.totalRecord,
            searchTerm: this.searchInputCorpEmpID,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder == "ASC" ? "DESC" : "ASC",
            Name: this.searchInputEmailName
        }
        let currentUser = this.authService.currentUser;
        this.getUsersList(parseInt(currentUser.CorporateinfoID), 1, filterBy);
    }

    GetCurrentPageRecored(event: any): void {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPage,
            currentPage: event.page,
            totalRecord: this.totalRecord,
            searchTerm: this.searchInputCorpEmpID,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder == "ASC" ? "DESC" : "ASC",
            Name: this.searchInputEmailName
        }
        let currentUser = this.authService.currentUser;
        this.getUsersList(parseInt(currentUser.CorporateinfoID), 1, filterBy);
    }

    GetSortOrder(sortBy: string) {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPage,
            currentPage: this.currentPage,
            totalRecord: this.totalRecord,
            searchTerm: this.searchTerm,
            sortBy: sortBy,
            sortOrder: this.sortOrder == "ASC" ? "DESC" : "ASC"
        }
        let currentUser = this.authService.currentUser;

        this.getUsersList(parseInt(currentUser.CorporateinfoID), 1, filterBy);
    }

    onSearchByUserName(userName: string) {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPage,
            currentPage: this.currentPage,
            totalRecord: this.totalRecord,
            searchTerm: this.searchInputCorpEmpID,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder == "ASC" ? "DESC" : "ASC",
            Name: this.searchInputEmailName
        }

        let currentUser = this.authService.currentUser;
        this.getUsersList(parseInt(currentUser.CorporateinfoID), 1, filterBy);
    }

    showFilterBox() {
        this.IsShowFilterBox = !this.IsShowFilterBox;
    }

}
