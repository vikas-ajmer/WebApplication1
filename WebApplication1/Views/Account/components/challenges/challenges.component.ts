import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ChallengeService } from '../../services/challenge.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/Utilities";
import { Constants } from "../../services/constants";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'challenges-component',
    templateUrl: './challenges.component.html',
    styleUrls: ['./challenges.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class ChallengeComponent implements OnInit {

    challengeList: any;
    corporatesList: any;
    corporateTypeList: any;

    userID: number = 0;
    userCorporateID: number;
    
    recoredPerPage: number = 10;
    currentPage: number = 1;
    totalRecored: number = 0;
    searchTerm: string = "";
    challengeType: number = 0;
    challengeTypeName: string = "All";

    selectCorporateName: any = "All";

    corporateID: number = 0;

    individualChallengeList: any;
    individualCorporatesList: any;
    challengeCategoryList: any;
    individualTotalRecored: number = 0;

    individualCorporateID: number = 0;
    individualCurrentPage: number = 1;
    individualRecoredPerPage: number = 10;
    individualSearchTerm: string = "";
    selectCorporateName2: any = "All";
    challengeCategory: string = "";
    challengeCategoryName: string = "All";
    constructor(private challengeService: ChallengeService, private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService) {
        this.userID = parseInt(authService.currentUser.UserID);
        this.corporateTypeList = [{ "TypeId": 0, "TypeName": "All" }, { "TypeId": 1, "TypeName": "Team Challenge" }, { "TypeId": 2, "TypeName": "Step Challenge" }, { "TypeId": 3, "TypeName": "Adventure" }];
        this.corporatesList = [{ "CorporateInfoID": 0, "CorporateInfo_Name": "All" }];
        this.individualCorporatesList = [{ "CorporateInfoID": 0, "CorporateInfo_Name": "All" }];
        this.challengeCategoryList = [{ "TypeId": '', "TypeName": "All" }, { "TypeId": 'Eat Right', "TypeName": "Eat Right" }, { "TypeId": 'Get Fit', "TypeName": "Get Fit" }, { "TypeId": 'Stay Happy', "TypeName": "Stay Happy" }];
    }

    ngOnInit() {
        this.getCorporatesList();
        setTimeout(() => {
            this.getChallengeList();
            this.getIndividualChallengeList();
        }, 300);
    }

    getChallengeList() {
        this.loadingService.showLoader(true);
        this.challengeService.challengeList(this.userID, this.corporateID, this.currentPage, this.recoredPerPage, this.challengeType, this.searchTerm).subscribe(
            res => {
                this.challengeList = res.Data;
                this.totalRecored = res.TotalRecored;
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getChallengeList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getChallengeList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    getIndividualChallengeList() {
        this.loadingService.showLoader(true);
        this.challengeService.individualChallengeList(this.userID, this.individualCorporateID, this.individualCurrentPage, this.individualRecoredPerPage, this.individualSearchTerm, this.challengeCategory).subscribe(
            res => {
                this.individualChallengeList = res.Data;
                this.individualTotalRecored = res.TotalRecored;
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getIndividualChallengeList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getIndividualChallengeList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    getCorporatesList() {
        this.challengeService.getCorporatesList(this.userID).subscribe(
            res => {                    
                this.corporatesList = this.corporatesList.concat(res.result);
                this.individualCorporatesList = this.corporatesList.concat(res.result);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getCorporatesList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getCorporatesList").subscribe(res => { }, error => { });
                }
            });
    }

    setCorporate(corpId: any) {
        for (let corporate of this.corporatesList) {
            if (corporate.CorporateInfoID == corpId) {
                this.selectCorporateName = corporate.CorporateInfo_Name;
                this.corporateID = corpId;
                break;
            }
        }
    }
    setCorporateType(typeId: any) {
        for (let item of this.corporateTypeList) {
            if (item.TypeId == typeId) {
                this.challengeTypeName = item.TypeName;
                this.challengeType = typeId;
                break;
            }
        }
    }
    GetCurrentPageRecored(event: any): void {
        this.currentPage = event.page;
        this.getChallengeList();
    }
    searchChallenges() {
        this.currentPage = 1;
        this.getChallengeList();
    }


    setIndividualCorporate(corpId: any) {
        for (let corporate of this.individualCorporatesList) {
            if (corporate.CorporateInfoID == corpId) {
                this.selectCorporateName2 = corporate.CorporateInfo_Name;
                this.individualCorporateID = corpId;
                break;
            }
        }
    }
    setIndividualCorporateType(typeId: any) {
        for (let item of this.challengeCategoryList) {
            if (item.TypeId == typeId) {
                this.challengeCategoryName = item.TypeName;
                this.challengeCategory = typeId;
                break;
            }
        }
    }
    GetCurrentPageRecoredIndividual(event: any): void {
        this.individualCurrentPage = event.page;
        this.getIndividualChallengeList();
    }
    searchIndividualChallenges() {
        this.currentPage = 1;
        this.getIndividualChallengeList();
    }
    
}