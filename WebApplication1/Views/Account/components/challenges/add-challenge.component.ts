import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { AuthService } from "../../services/auth.service";
import { ChallengeService } from '../../services/challenge.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/Utilities";
import { Constants } from "../../services/constants";
@Component({
    selector: 'add-challenge',
    templateUrl: './add-challenge.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class AddChallengeComponent implements OnInit {
    step: string = "choose";
    IsDetailActive: boolean = false;
    IsDetailComplete: boolean = false;
    IsEnrollActive: boolean = false;
    IsEnrollComplete: boolean = false;
    IsSendActive: boolean = false;
    challengeType: any;
    User: any;
    UserId: any;

    ChallengeId: number = 0;
    IsShowComponent: boolean = false;
    ChallengeCounting: any[] = [];
    corporateList: any[] = [];
    headerName = "Create A Challenge";

    constructor(private router: Router, private location: Location, private loadingService: LoadingService, private authService: AuthService, private challengeService: ChallengeService, private errorLog: ErrorLogService) {
        let currentuser = authService.currentUser;
        this.User = currentuser;
        this.UserId = parseInt(currentuser.MemberID);
        this.ChallengeCounting = [
            { label: 'Burpees', value: 'Burpees' }, { label: 'Calories', value: 'Calories' }, { label: 'Crunches', value: 'Crunches' },
            { label: 'Days', value: 'Days' }, { label: 'Feet', value: 'Feet' }, { label: 'Floors', value: 'Floors' },
            { label: 'Grams of Fiber', value: 'Grams of Fiber' }, { label: 'Hours', value: 'Hours' }, { label: 'Hours of Slept', value: 'Hours of Slept' },
            { label: 'Jumping Jacks', value: 'Jumping Jacks' }, { label: 'Kilometers', value: 'Kilometers' }, { label: 'Laps', value: 'Laps' },
            { label: 'Liters', value: 'Liters' }, { label: 'Lunges', value: 'Lunges' }, { label: 'Meters', value: 'Meters' },
            { label: 'Miles', value: 'Miles' }, { label: 'Miles Cycled', value: 'Miles Cycled' }, { label: 'Minutes of Exercise', value: 'Minutes of Exercise' },
            { label: 'Ounces', value: 'Ounces' }, { label: 'Points', value: 'Points' }, { label: 'Push Ups', value: 'Push Ups' },
            { label: 'Pull Ups', value: 'Pull Ups' }, { label: 'Raises', value: 'Raises' }, { label: 'Servings', value: 'Servings' },
            { label: 'Servings of Fruits and Vegetables', value: 'Servings of Fruits and Vegetables' }, { label: 'Sit Up', value: 'Sit Up' },
            { label: 'Squats', value: 'Squats' }, { label: 'Times', value: 'Times' }, { label: 'Steps', value: 'Steps' },
            { label: 'Yards', value: 'Yards' }
        ];
        challengeService.notify().subscribe(res => {
            this.step = res;
            this.GetActiveAndCompeletedtab();
        });
    }
    ngOnInit() {
        setTimeout(() => {
            this.getCorporatesList();
        }, 1);
    }
    GetActiveAndCompeletedtab() {
        if (this.step == "individual-detail" || this.step == "team-detail" || this.step == "adventure-detail" || this.step == "adventure-setdetails") {
            this.IsDetailActive = true;
            this.IsDetailComplete = this.IsEnrollActive = this.IsEnrollComplete = this.IsSendActive = false;
            if (this.step == "adventure-setdetails") {
                //this.AdventureId = 10;
            }
        }
        if (this.step == "individual-enroll" || this.step == "team-enroll") {
            this.IsDetailComplete = this.IsEnrollActive = true;
            this.IsDetailActive = this.IsSendActive = this.IsEnrollComplete = false;
        }
        if (this.step == "individual-sendinvitation" || this.step == "team-send-invitation") {
            this.IsDetailComplete = this.IsEnrollComplete = this.IsSendActive = true;
            this.IsDetailActive = this.IsEnrollActive = false;
        }
    }
    getCorporatesList() {
        this.loadingService.showLoader(true);
        this.challengeService.getCorporatesList(this.User.UserID).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    res.result.forEach((el) => { this.corporateList.push({ id: el.CorporateInfoID, itemName: el.CorporateInfo_Name }) });
                }
                else {
                    this.loadingService.showMessage("error", "Error in getting corporate list", MessageSeverity.error);
                }
                
                this.loadingService.showLoader(false);
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
                this.loadingService.showLoader(false);
            });
    }

    GoToChallengeComponent() {
        if (this.challengeType != undefined && this.challengeType != null && this.challengeType != "undefined") {
            switch (this.challengeType) {
                case 1:
                case "1":
                    //this.location.replaceState("/challenge/add/individual");
                    this.headerName = "Individual Challenge";
                    this.challengeService.getStep("individual-detail");
                    break;
                case 2:
                case "2":
                    this.headerName = "Team Challenge";
                    this.challengeService.getStep("team-detail");
                    break;
                case 3:
                case "3":
                    this.headerName = "Adventure Challenge";
                    this.challengeService.getStep("adventure-detail");
                    break;
                case 4:
                case "4":
                    this.headerName = "Step Challenge";
                    this.step = "step-challenge-previouslist";
                    //this.challengeService.getStep("step-challenge-previouslist");
                    this.router.navigate(["challenge/step-challenge/previous"]);
                    break;
            }
            this.IsShowComponent = true;
        }
        else
            this.loadingService.showMessage("Info", "Please select a challenge type.", MessageSeverity.info);
    }
}
