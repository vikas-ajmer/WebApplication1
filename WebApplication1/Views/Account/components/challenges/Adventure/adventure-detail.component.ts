import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';

import { ChallengeService } from '../../../services/challenge.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { AuthService } from "../../../services/auth.service";
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    selector: 'adventure-challenge',
    templateUrl: './adventure-detail.component.html',
    styleUrls: ['./adventure-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdventureChallengeComponent implements OnInit {

    adventureList: any;
    @Input() UserId: number = 0;

    searchTerm: string = "";
    currentPage: number = 1;
    recoredPerPage: number = 10;
    totalRecored: number = 0;

    constructor(private challengeService: ChallengeService, private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService, private location: Location, private router: Router) {

    }

    ngOnInit() {
        setTimeout(() => {
            this.getAdventureList();
        }, 200);
    }

    getAdventureList() {
        this.loadingService.showLoader(true);
        this.challengeService.getAdeventurelist(this.searchTerm, this.currentPage, this.recoredPerPage).subscribe(
            res => {
                this.adventureList = res.Data;
                this.totalRecored = res.TotalRecords;
                console.log(res.length);
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getAdventureList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "getAdventureList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    CreateNewAdventureComponent() {
        this.router.navigate(["challenge/adventure-create/" + 0], { replaceUrl: true });
        //this.challengeService.getStep('adventure-create');
    }
    searchChallenges() {
        this.currentPage = 1;
        this.getAdventureList();
    }
    GetCurrentPageRecored(event: any): void {
        this.currentPage = event.page;
        this.getAdventureList();
    }
    AssignAdventure(adventureId: any) {
        debugger;
        this.router.navigate(["challenge/adventure-assigncorporate/" + adventureId], { replaceUrl: true });
        this.challengeService.getStep('adventure-assigncorporate');
    }
}