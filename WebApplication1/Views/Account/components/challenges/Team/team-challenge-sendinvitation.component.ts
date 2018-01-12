import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { Router } from "@angular/router";

import { ChallengeService } from '../../../services/challenge.service';
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
@Component({
    selector: 'team-challenge-sendinvitation',
    templateUrl: './team-challenge-sendinvitation.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class TeamSendInvitationComponent implements OnInit {
    teamChallenge: any = {};
    @Input() User: any = {};
    MailSubject: string = "";
    MailDisplayName: string = "";
    MailTemplate: string = "";
    ckconfig: any = {
        height: 300
    }
    constructor(private router: Router, private loadingService: LoadingService, private challengeService: ChallengeService, private errorLog: ErrorLogService) {
    }
    ngOnInit() {
        this.teamChallenge = this.challengeService.getTeamChallenge();
        this.MailSubject = this.teamChallenge.mailSubject;
        this.MailTemplate = this.teamChallenge.mailTemplate;
    }
    SendEmailToEnrolledMembers(): void {
        if (this.MailTemplate == "" || this.MailTemplate == undefined || this.MailTemplate == "undefined") {
            this.loadingService.showMessage("", "Mail template is required.", MessageSeverity.info);
            return;
        }
        else {
            this.loadingService.showLoader(true);
            this.challengeService.SendEmailToEnrolledTeamMember(this.teamChallenge.Id, this.User.MemberID, this.MailSubject, this.MailDisplayName, this.MailTemplate).subscribe((res: any) => {
                if (res.status == 1 || res.status == "1") {
                    this.loadingService.showMessage("Success", res.Msg, MessageSeverity.success);
                    this.router.navigate(["/challenges"]);
                }
                else {
                    this.loadingService.showMessage("Error", res.Msg, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            }, error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SendEmailToEnrolledMembers").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SendEmailToEnrolledMembers").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
        }
    }
}