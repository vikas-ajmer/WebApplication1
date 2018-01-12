import { Component, OnInit, ViewEncapsulation, Input, NgModule } from '@angular/core';
import { Router } from '@angular/router';

import { StepChallengeService } from '../../../services/step-challenge.service';
import { ChallengeService } from '../../../services/challenge.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { AuthService } from "../../../services/auth.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
import { StepChallenge } from '../../../models/challenge.model';


@Component({
    selector: 'step-challenge-previouslist',
    templateUrl: './step-challenge-previouslist.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})

export class StepChallengePreviousListComponent implements OnInit {

    previousStepChallengeList: any[] = [];
    userID: number = 0;
    step: string = "step-challenge-previouslist";
    headerName: string = "Step Challenge";

    currentPage: number = 1;
    recoredPerPage: number = 20;
    totalRecored: number = 50;


    public stepChallenge = new StepChallenge(0, "", 0, 0, "", "", "", "", 0, null, null, null, 0, 0, 0, 0, "", "", "", 0, 1, 20);

    constructor(private router: Router, private stepchallengeService: StepChallengeService, private challengeService: ChallengeService,
                private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {

        this.userID = parseInt(authService.currentUser.UserID);
    }

    ngOnInit() {
        setTimeout(() => {
            this.getPreviousStepChallengeList();
        }, 1)
    }

    getPreviousStepChallengeList() {
        this.stepChallenge.userCorporateID = this.userID;
        this.stepchallengeService.getStepChallengeList(this.stepChallenge).subscribe(
            res => {
                this.previousStepChallengeList = res.stepChallengeList;
                this.totalRecored = res.totalCount;
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-getStepChallengeList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "StepChallenge-getStepChallengeList").subscribe(res => { }, error => { });
                }
            });
    }

    GetCurrentPageRecored(event: any): void {
        this.currentPage = event.page;
        this.stepChallenge.PageIndex = this.currentPage;
        this.getPreviousStepChallengeList();
    }

    GoToCreateChallenge(type, id) {
        this.step = "step-challenge-create";
        this.router.navigate(["challenge/step-challenge/create/" + id]);
    }


}