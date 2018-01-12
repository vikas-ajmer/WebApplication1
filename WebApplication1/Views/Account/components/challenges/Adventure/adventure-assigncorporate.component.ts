import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ChallengeService } from '../../../services/challenge.service';
import { AdventureService } from '../../../services/adventure.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { AuthService } from "../../../services/auth.service";
import { AdventureChallenge, AdventureCorporateModel } from '../../../models/challenge.model';

@Component({
    selector: 'adventure-assigncorporate',
    templateUrl: './adventure-assigncorporate.component.html',
    styleUrls: ['./adventure-assigncorporate.component.css'],
    encapsulation: ViewEncapsulation.None,
    providers: [AdventureService]
})
export class AdventureAssignCorporateComponent implements OnInit {
    teamMemberNo: number;
    corporateID: number = -1;
    selectCorporateName: string;
    userID: number = 0;
    corporatesList: any[] = [];
    step: string = "assigncorporate-details";

    advId: number;
    ACorporate_ID: number;

    adventureList: any;

    today = new Date();
    minDate: Date = new Date();
    bsValue: Date = new Date();
    bsEndValue: Date = new Date();

    IsDetailActive: boolean = true;
    IsDetailComplete: boolean = false;

    public adventureChallenge = new AdventureChallenge(0, "", "", 0, 0, 0, 0, "", "", false, 0, "", "", "", 0);
    public adventureCorporateModel = new AdventureCorporateModel(0, 0, 0, null, null, 0, null, 0, true, "", "");


    constructor(private router: Router, private route: ActivatedRoute, private challengeService: ChallengeService,
        private adventureService: AdventureService, private errorLog: ErrorLogService, private loadingService: LoadingService,
        private authService: AuthService) {
        
        let routeParams = this.route.snapshot.paramMap;
        let adventureID = routeParams.get('adventureid');
        let ACorporate_ID = parseInt(routeParams.get('acorporate_id'));

        if (ACorporate_ID > 0) {
            this.ACorporate_ID = ACorporate_ID;
            this.step = "assigncorporate-enrollteams";
            this.IsDetailActive = false;
            this.IsDetailComplete = true;
            return;
        }

        if (adventureID) {
            this.adventureCorporateModel.ACorporate_AdventureID = parseInt(adventureID);
            this.advId = parseInt(adventureID);
        }
        else {

        }

        this.userID = parseInt(authService.currentUser.UserID);
        this.corporatesList = [{ "CorporateInfoID": -1, "CorporateInfo_Name": "Select Corporate" }];

        this.adventureCorporateModel.ACorporate_CorporateInfoID = -1;
        this.adventureCorporateModel.ACorporate_MinimumMember = 1;        

        this.bsValue.setDate(this.today.getDate() + 2);
        this.minDate.setDate(this.today.getDate() + 2);
        this.bsEndValue.setDate(this.today.getDate() + 2);

        this.adventureCorporateModel.ACorporate_StartDate = this.minDate;
        this.adventureCorporateModel.ACorporate_EndDate = this.bsEndValue;
                
    }
    ngOnInit() {
        setTimeout(() => {
            this.getCorporatesList();
        }, 300);
    }
    getCorporatesList() {
        this.loadingService.showLoader(true);
        this.adventureService.getCorporatesList(this.userID).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.corporatesList = this.corporatesList.concat(res);
                }
                else {
                    this.loadingService.showMessage("error", "Error in getting corporate list", MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getChallengeList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "getChallengeList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    AssignAdventureToCorporate() {
        console.log(this.adventureCorporateModel);
        this.loadingService.showLoader(true);
        //console.log(this.adventureCorporateModel.ACorporate_StartDate.toUTCString(), this.adventureCorporateModel.ACorporate_StartDate.toLocaleString());
        this.adventureCorporateModel.ACorporate_StartDate_String = this.adventureCorporateModel.ACorporate_StartDate.toLocaleDateString();
        this.adventureCorporateModel.ACorporate_EndDate_String = this.adventureCorporateModel.ACorporate_EndDate.toLocaleDateString();
        this.adventureCorporateModel.ACorporate_CreateBy = 1;
        this.adventureService.AssignAdventureToCorporate(this.adventureCorporateModel).subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("error", res.Msg, MessageSeverity.error);
                }
                if (res.status == 1 || res.status == "1") {

                    this.loadingService.showMessage("success", "Success", MessageSeverity.success);
                    this.adventureService.setAdventureData(this.adventureCorporateModel.ACorporate_CorporateInfoID);
                    this.router.navigate(["challenge/adventure-assigncorporate/" + this.advId + "/" + res.ACorporate_ID]);
                    //this.step = "assigncorporate-enrollteams";
                }                
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "AssignAdventureToCorporate").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "AssignAdventureToCorporate").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });

        
        //this.loadingService.showLoader(false);
    }
}