import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

//service
import { UserService } from '../../services/user.service';
import { ErrorLogService } from "../../services/error.log.service";
import { AuthService } from "../../services/auth.service";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { UserProfileService } from "../../services/user-profile.service";
//service

//model
import * as UserProfileModel from "../../models/user-profile.model";
//model

import { Utilities } from "../../services/Utilities";
import { Constants } from "../../services/constants";

@Component({
    selector: 'user-profile-component',
    templateUrl: './user-profile.component.html',
    styleUrls: []
})

export class UserProfileComponent implements OnInit {

    public userModel = new UserProfileModel.WrapperModel<UserProfileModel.UserProfileModel>(UserProfileModel.UserProfileModel);
    public userSteps = new UserProfileModel.WrapperModel<Array<UserProfileModel.MemberSteps>>(Array);
    public userPrograms = new UserProfileModel.WrapperModel<Array<UserProfileModel.MemberPrograms>>(Array);
    public userChallenges = new UserProfileModel.WrapperModel<Array<UserProfileModel.MemberChallenges>>(Array);
    public userPepStatement = new UserProfileModel.WrapperModel<Array<UserProfileModel.MemberPointsStatement>>(Array);
    public userPepStatement_Monthly = new UserProfileModel.WrapperModel<Array<UserProfileModel.MemberPointsStatement_Monthly>>(Array);

    public MemberID: number;
    public searchInputChallengeName: string = "";
    public searchInputProgramName: string = "";
    //steps
    public recoredPerPage: number = 10;
    public currentPage: number = 1;
    public totalRecord: number = 0;
    public searchTerm: string = "";
    public sortBy: string = "date";
    public sortOrder: string = "DESC";
    //steps

    // programs
    public recoredPerPageProgram: number = 10;
    public currentPageProgram: number = 1;
    public totalRecordProgram: number = 0;
    public searchTermProgram: string = "";
    public sortByProgram: string = "program";
    public sortOrderProgram: string = "DESC";
    //programs

    //challenge
    public recoredPerPageChallenge: number = 10;
    public currentPageChallenge: number = 1;
    public totalRecordChallenge: number = 0;
    public searchTermChallenge: string = "";
    public sortByChallenge: string = "challenge";
    public sortOrderChallenge: string = "DESC";
    //challenge

    constructor(private route: ActivatedRoute, private profileService: UserProfileService,
        private loadingService: LoadingService,
        private errorLog: ErrorLogService, private authService: AuthService) {
        let routeParams = route.snapshot.params;
        this.MemberID = routeParams.id;
    }

    ngOnInit() {
        let $this = this,
            currentUser = this.authService.currentUser;

        let filterBy: any = {
            recoredPerPage: 10,
            currentPage: 1,
            totalRecord: 0,
            searchTerm: "",
            sortBy: "date",
            sortOrder: "DESC"
        }

        $this.getUserProfileByMemberID($this.MemberID);
        $this.getMemberSteps($this.MemberID, filterBy);
        filterBy.sortBy = "prog";
        $this.getMemberPrograms($this.MemberID, filterBy);
        filterBy.sortBy = "challenge";
        $this.getMemberChallenges($this.MemberID, filterBy);
        $this.getMemberPointsStatement($this.MemberID);
    }

    //user profile
    getUserProfileByMemberID(memberID: number) {
        this.userModel.ShowLoading = true;
        this.profileService.getUserProfileByMemberID(memberID).subscribe((res: UserProfileModel.UserProfileModel) => {
            this.userModel.Entity = res;
            this.userModel.ShowLoading = false;
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getUserProfileByMemberID").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getUserProfileByMemberID").subscribe(res => { }, error => { });
                }
                this.userModel.ShowLoading = false;
            });
    }

    //member steps
    getMemberSteps(memberID: number, filterBy: any) {
        this.userSteps.ShowLoading = true;
        this.profileService.getMemberSteps(memberID, filterBy).subscribe((res: any) => {
            this.userSteps.Entity = res.result;
            this.userSteps.ShowLoading = false;
            if (this.userSteps.Entity && this.userSteps.Entity.length > 0) {
                this.totalRecord = this.userSteps.Entity[0].TotalCount;
            }
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getMemberSteps").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getMemberSteps").subscribe(res => { }, error => { });
                }
                this.userSteps.ShowLoading = false;
            });

    }

    //member programs
    getMemberPrograms(memberID: number, filterBy: any) {
        this.userPrograms.ShowLoading = true;
        this.profileService.getMemberPrograms(memberID, filterBy).subscribe((res: any) => {
            this.userPrograms.Entity = res.result;
            this.userPrograms.ShowLoading = false;
            if (this.userPrograms.Entity && this.userPrograms.Entity.length > 0) {
                this.totalRecordProgram = this.userPrograms.Entity[0].TotalCount;
            }
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getMemberPrograms").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getMemberPrograms").subscribe(res => { }, error => { });
                }
                this.userPrograms.ShowLoading = false;
            });
    }

    //member challenges
    getMemberChallenges(memberID: number, filterBy: any) {
        this.userChallenges.ShowLoading = true;
        this.profileService.getMemberChallenges(memberID, filterBy).subscribe((res: any) => {
            this.userChallenges.Entity = res.result;
            this.userChallenges.ShowLoading = false;
            if (this.userChallenges.Entity && this.userChallenges.Entity.length > 0) {
                this.totalRecordChallenge = this.userChallenges.Entity[0].TotalCount;
            }
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getMemberChallenges").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getMemberChallenges").subscribe(res => { }, error => { });
                }
                this.userChallenges.ShowLoading = false;
            });
    }

    //member points statement
    getMemberPointsStatement(memberID: number) {
        this.userPepStatement.ShowLoading = true;
        this.profileService.getMemberPointsStatement(memberID).subscribe((res: any) => {
            this.userPepStatement.Entity = res.result;
            this.userPepStatement.ShowLoading = true;
            if (this.userPepStatement.Entity && this.userPepStatement.Entity.length > 0) {
                this.getMemberPointsStatement_Monthly(this.MemberID, this.userPepStatement.Entity[0].StatementDate);
            }
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getMemberPointsStatement").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getMemberPointsStatement").subscribe(res => { }, error => { });
                }
                this.userPepStatement.ShowLoading = false;
            });
    }

    //member points statement monthly
    getMemberPointsStatement_Monthly(memberID: number, date: any) {
        this.userPepStatement_Monthly.ShowLoading = true;
        this.profileService.getMemberPointsStatement_Monthly(memberID, date).subscribe((res: any) => {
            this.userPepStatement_Monthly.Entity = res.result;
            this.userPepStatement_Monthly.ShowLoading = false;
            this.userPepStatement_Monthly.Entity.forEach(f => {
                f.ActivityDate = date;
            });
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getMemberPointsStatement_Monthly").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getMemberPointsStatement_Monthly").subscribe(res => { }, error => { });
                }
                this.userPepStatement_Monthly.ShowLoading = false;
            });
    }

    onMonthChangePEPs(value: any) {
        if (value && value != "NOMONTH") {
            this.getMemberPointsStatement_Monthly(this.MemberID, value);
        }
    }

    GetCurrentPageRecored(event: any): void {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPage,
            currentPage: event.page,
            totalRecord: this.totalRecord,
            searchTerm: this.searchTerm,
            sortBy: this.sortBy,
            sortOrder: this.sortOrder == "ASC" ? "DESC" : "ASC"
        }
        let currentUser = this.authService.currentUser;
        this.getMemberSteps(this.MemberID, filterBy);
    }

    GetSortOrder(value: string) {
        this.sortOrder = this.sortOrder == "ASC" ? "DESC" : "ASC";
        let filterBy: any = {
            recoredPerPage: this.recoredPerPage,
            currentPage: this.currentPage,
            totalRecord: this.totalRecord,
            searchTerm: this.searchTerm,
            sortBy: value,
            sortOrder: this.sortOrder
        }

        let currentUser = this.authService.currentUser;
        this.getMemberSteps(this.MemberID, filterBy);
    }

    //program list filtering
    GetProgramsRecordChange(event: any): void {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPageProgram,
            currentPage: event.page,
            totalRecord: this.totalRecordProgram,
            searchTerm: this.searchTermProgram,
            sortBy: this.sortByProgram,
            sortOrder: this.sortOrderProgram == "ASC" ? "DESC" : "ASC"
        }
        let currentUser = this.authService.currentUser;
        this.getMemberPrograms(this.MemberID, filterBy);
    }

    GetProgramsSortOrder(value: string) {
        this.sortOrderProgram = this.sortOrderProgram == "ASC" ? "DESC" : "ASC";
        let filterBy: any = {
            recoredPerPage: this.recoredPerPageProgram,
            currentPage: this.currentPageProgram,
            totalRecord: this.totalRecordProgram,
            searchTerm: this.searchTermProgram,
            sortBy: value,
            sortOrder: this.sortOrderProgram
        }

        let currentUser = this.authService.currentUser;
        this.getMemberPrograms(this.MemberID, filterBy);
    }

    onSearchProgramName(value: string) {
        this.sortOrderProgram = this.sortOrderProgram == "ASC" ? "DESC" : "ASC";
        let filterBy: any = {
            recoredPerPage: this.recoredPerPageProgram,
            currentPage: this.currentPageProgram,
            totalRecord: this.totalRecordProgram,
            searchTerm: this.searchInputProgramName,
            sortBy: this.sortByProgram,
            sortOrder: this.sortOrderProgram
        }

        let currentUser = this.authService.currentUser;
        this.getMemberPrograms(this.MemberID, filterBy);
    }
    //program list filtering

    //challenge list challenge
    GetChallengeRecordChange(event: any): void {
        let filterBy: any = {
            recoredPerPage: this.recoredPerPageChallenge,
            currentPage: event.page,
            totalRecord: this.totalRecordChallenge,
            searchTerm: this.searchTermChallenge,
            sortBy: this.sortByChallenge,
            sortOrder: this.sortOrderChallenge == "ASC" ? "DESC" : "ASC"
        }
        let currentUser = this.authService.currentUser;
        this.getMemberChallenges(this.MemberID, filterBy);
    }

    GetChallengeSortOrder(value: string) {
        this.sortOrderChallenge = this.sortOrderChallenge == "ASC" ? "DESC" : "ASC";
        let filterBy: any = {
            recoredPerPage: this.recoredPerPageChallenge,
            currentPage: this.currentPageChallenge,
            totalRecord: this.totalRecordChallenge,
            searchTerm: this.searchTermChallenge,
            sortBy: value,
            sortOrder: this.sortOrderChallenge
        }

        let currentUser = this.authService.currentUser;
        this.getMemberChallenges(this.MemberID, filterBy);
    }

    onSearchChallengeName(value: string) {
        this.sortOrderChallenge = this.sortOrderChallenge == "ASC" ? "DESC" : "ASC";
        let filterBy: any = {
            recoredPerPage: this.recoredPerPageChallenge,
            currentPage: this.currentPageChallenge,
            totalRecord: this.totalRecordChallenge,
            searchTerm: this.searchInputChallengeName,
            sortBy: this.sortByChallenge,
            sortOrder: this.sortOrderChallenge
        }

        let currentUser = this.authService.currentUser;
        this.getMemberChallenges(this.MemberID, filterBy);
    }
    //challenge list challenge
}


