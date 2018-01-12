import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';

import { ChallengeService } from '../../../services/challenge.service';
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { Question, TeamChallenge } from "../../../models/challenge.model";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
@Component({
    selector: 'team-challenge-detail',
    templateUrl: './team-challenge-detail.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class TeamChallengeDetailComponent implements OnInit {
    @Input() User: any = {};
    @Input() corporateList: any[] = [];
    @Input() ChallengeId: any = 0;
    AllQuestion: Question[] = [];
    isLogoUpdate: boolean = false;
    ImgUrl: any = "";
    Category: any[] = [];
    QIAFEdit: number[] = [];
    question: Question = new Question("", "", "", 1, null);
    teamChallenge: TeamChallenge = new TeamChallenge(0, 0, "", 0, "", "", null, "", "","", 0, 0, 0, []);
    selectedFiles: any;
    selectedFileName: any;
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };
    constructor(private loadingService: LoadingService, private challengeService: ChallengeService, private errorLog: ErrorLogService, private ng4FilesService: Ng4FilesService) {
    }
    ngOnInit() {
        this.getCategoryList();
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        setTimeout(() => {
            this.getTeamChallenge(this.ChallengeId);
        }, 100);
    }
    getCategoryList() {
        this.challengeService.GetCategoryList().subscribe(
            res => {
                this.Category = res;
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetCategoryList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "GetCategoryList").subscribe(res => { }, error => { });
                }
            });
    }
    getTeamChallenge(Id: any) {
        this.loadingService.showLoader(true);
        this.challengeService.GetTeamChallenge(Id).subscribe(
            res => {
                this.teamChallenge = res.data;
                this.ImgUrl = res.Img;
                this.AllQuestion = res.data.questions;
                this.teamChallenge.userid = this.User.MemberID;
                this.teamChallenge.UserCorporateID = this.User.CorporateinfoID;
                this.question.start = this.teamChallenge.chellangeDuration + 1;
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getTeamChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getTeamChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    AddNewQuestion(): void {
        if (this.question.title == "" || this.question.desired == "" || this.question.alternate == "" || (this.question.desired == this.question.alternate)) {
            let Msg = this.question.title == "" ? "Question title is required" : this.question.desired == "" ? "Desired answer is required" : this.question.alternate == "" ? "Alternate answer is required" : "Alternate or desired can not be same";
            this.loadingService.showMessage("require", Msg, MessageSeverity.info);
            return;
        }
        if (this.question.end < this.question.start) {
            this.loadingService.showMessage("warning", "Repeat till day should be greater than start day", MessageSeverity.warn);
            return;
        }
        this.AllQuestion.push(this.question);
        this.teamChallenge.chellangeDuration = this.question.end;
        let _start = this.question.end + 1;
        this.question = new Question("", "", "", _start, null);
    }

    DeleteQuestion(index: any): void {
        if (index > 0)
        {
            this.teamChallenge.chellangeDuration = this.AllQuestion[index - 1].end;
            this.question.start = this.AllQuestion[index - 1].end + 1;
        }
        else
        {
            this.teamChallenge.chellangeDuration = 0;
            this.question.start = 1;
        }
        this.AllQuestion.splice(index, 1);
    }
    EditQuestion(index: any, IsPush: boolean): void {
        if (IsPush)
            this.QIAFEdit.push(index);
        else {
            let _que = this.AllQuestion[index];
            if (_que.desired == "" || _que.alternate == "" || (_que.desired == _que.alternate)) {
                let Msg = _que.desired == "" ? "Desired answer is required" : _que.alternate == "" ? "Alternate answer is required" : "Alternate or desired can not be same";
                this.loadingService.showMessage("require", Msg, MessageSeverity.info);
                return;
            }
            if (this.AllQuestion.length == index + 1) {
                if (_que.end < _que.start) {
                    this.loadingService.showMessage("warning", "Repeat till day should be greater than start day", MessageSeverity.warn);
                    return;
                }
                this.teamChallenge.chellangeDuration = this.question.start;
                this.question.start = _que.end + 1;
            }
            let _ind = this.QIAFEdit.indexOf(index);
            this.QIAFEdit.splice(_ind, 1);
        }
    }

    filesSelect(selectedFiles: Ng4FilesSelected): void {
        if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
            let errormsg = selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_COUNT_EXCEED ? "no more file added"
                : selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED ? "file size is too large"
                    : selectedFiles.status == Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS ? "only jpg,jpeg or png file is allowed" : "";
            Utilities.ShowErrorAlert("", errormsg, "error");
            return;
        }

        this.selectedFiles = Array.from(selectedFiles.files).map(file => file.name);
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedFileName = file.name;
        this.teamChallenge.ImageName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
            this.teamChallenge.Image = this.selectedFiles;
        };
    }
    SaveTeamChallenge(): void {
        if (this.teamChallenge.challengeImage==""&&(this.selectedFiles == undefined || this.selectedFiles == "undefined" || this.selectedFiles == "")) {
            this.loadingService.showMessage("error", "challenge image is required", MessageSeverity.error);
            return;
        }
        if (this.AllQuestion.length == 0)
        {
            this.loadingService.showMessage("required", "Please add atleast one question", MessageSeverity.info);
            return;
        }
        if (this.teamChallenge.chellangeThreshold > this.teamChallenge.chellangeDuration)
        {
            this.loadingService.showMessage("Info", "Challenge threshold should be less than Challenge duration.", MessageSeverity.info);
            return;
        }
        this.teamChallenge.questions = this.AllQuestion;
        this.loadingService.showLoader(true);
        let CorporateName = this.corporateList.find((obj) => obj.id == this.teamChallenge.corporateinfoid).itemName;
        this.challengeService.SaveTeamChallenge(this.teamChallenge).subscribe(
            res => {
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showStickyMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status == 0 || res.status == "0") {
                    this.challengeService.seTeamChallenge({ Id: res.teamChallengeId, Name: this.teamChallenge.chellangeName, CorporateId: this.teamChallenge.corporateinfoid, CorporateName: CorporateName, IsSendMail: false });
                    this.loadingService.showMessage("success", res.Msg, MessageSeverity.success);
                    this.challengeService.getStep("team-enroll");
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveTeamChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveTeamChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
}