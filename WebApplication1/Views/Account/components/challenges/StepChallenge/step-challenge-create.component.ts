import { Component, OnInit, ViewEncapsulation, Input, NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ChallengeService } from '../../../services/challenge.service';
import { StepChallengeService } from '../../../services/step-challenge.service';
import { AuthService } from "../../../services/auth.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
import { StepChallenge } from '../../../models/challenge.model';


@Component({
    selector: 'step-challenge',
    templateUrl: './step-challenge-create.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})

export class StepChallengeCreateComponent implements OnInit {

    corporatesList: any[] = [];

    leaderboardBoardURL: string = "//thewellnesscorner.com/";
    rootURL: string = "//thewellnesscorner.com/";
    today = new Date();
    minDate: Date = new Date();
    bsValue: Date = new Date();
    bsEndValue: Date = new Date();
    chkTemp1: boolean = false;
    chkTemp2: boolean = false;
    step: string = "step-challenge-create";
    headerName: string = "Step Challenge";
    userID: number = 0;
    ChallengeId: number = 0;
    challengeTypeList: any[] = [
        { TypeId: 1, TypeName: 'Team' },
        { TypeId: 2, TypeName: 'Individual' }
    ];

    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };

    selectedFiles: any;
    selectedFileName: any;

    public stepChallenge = new StepChallenge(0, "", 0, 0, "", "", "", "", 0, null, null, null, 0, 0, 0, 0, "", "", "", 0, 1, 20);

    public datePipe = new DatePipe("en-US");

    constructor(private router: Router, private route: ActivatedRoute, private stepchallengeService: StepChallengeService, private challengeService: ChallengeService, private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {
        this.ChallengeId = Number(this.route.snapshot.paramMap.get('id'));

        this.userID = parseInt(authService.currentUser.UserID);
        this.bsValue.setDate(this.today.getDate() + 2);
        this.minDate.setDate(this.today.getDate() + 2);
        this.bsEndValue.setDate(this.today.getDate() + 3);
        if (this.ChallengeId > 0) {
            this.getStepChallengeById();
            this.ChallengeId = 0;
        }
        else {
        }


    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.getCorporatesList();
    }

    getCorporatesList() {
        this.stepchallengeService.getCorporatesList(this.userID).subscribe(
            res => {
                //if (res.status == 1 || res.status == "1")
                this.corporatesList = res;//.result;
                //else if (res.status == 0 || res.status == "0")
                //    console.log('--error--');
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getCorporatesList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "getCorporatesList").subscribe(res => { }, error => { });
                }
            });
    }

    getStepChallengeById() {
        this.stepchallengeService.getStepChallengeById(this.ChallengeId).subscribe(
            res => {
                this.stepChallenge.stepChallengeId = this.ChallengeId;//res.StepChallengeID
                this.stepChallenge.corporateId = res.SC_CorporateID;
                this.stepChallenge.challengeName = res.SC_ChallengeName;
                this.stepChallenge.description = res.SC_Description;
                this.stepChallenge.type = res.SC_ChallengeType;
                this.stepChallenge.targetSteps = res.SC_TargetSteps;
                this.stepChallenge.maxStepsPerDay = res.SC_MemberMaxStepsPerDay;

                //this.stepChallenge.startDate = res.SC_StartDate;
                //this.stepChallenge.endDate = res.SC_EndDate;

                //this.today = new Date(res.SC_StartDate);
                //this.bsValue = new Date(res.SC_StartDate);
                //this.bsEndValue = new Date(res.SC_EndDate);

                this.stepChallenge.pepsOnCompletion = res.SC_CompletionPeps;
                this.stepChallenge.leaderBoardurl = res.SC_URL;
                this.stepChallenge.leaderBoardDirectory = res.SC_URLDirectory;
                this.stepChallenge.leaderBoardTemplate = res.SC_LeaderBoardTemplate;
                this.chkTemp1 = res.SC_LeaderBoardTemplate == "Temp1" ? true : false;
                this.chkTemp2 = res.SC_LeaderBoardTemplate == "Temp2" ? true : false;
                this.stepChallenge.imageName = res.SC_ImageName;
                this.selectedFileName = res.SC_ImageName;
                this.selectedFiles = res.SC_ImageURL
                //this.stepChallenge.image = res.SC_ImageURL;
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-getStepChallengeById").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "StepChallenge-getStepChallengeById").subscribe(res => { }, error => { });
                }
            });
    }


    chagneCorporate(ev) {
        this.stepChallenge.corporateId = ev.target.value;
        this.stepChallenge.corporateName = ev.target.options[ev.target.selectedIndex].text;
        this.leaderboardBoardURL = this.rootURL + (this.stepChallenge.corporateName).replace(/\s/g, "").toLowerCase() + "/";
        this.stepChallenge.leaderBoardurl = this.leaderboardBoardURL;
    }

    changeChallengeType(ev) {
        this.stepChallenge.type = ev.target.value;
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
        this.stepChallenge.imageName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
            this.stepChallenge.image = this.selectedFiles;
        };
    }

    ValidateTemplate(type) {
        if (type == 1) {
            this.stepChallenge.leaderBoardTemplate = "Temp1";
        }
        else {
            this.stepChallenge.leaderBoardTemplate = "Temp2";
        }
    }

    SaveStepChallenge() {

        if (this.stepChallenge.stepChallengeId == 0) {
            if (this.selectedFiles == undefined || this.selectedFiles == "undefined" || this.selectedFiles == "") {
                this.loadingService.showMessage("error", "Step Challenge image is required", MessageSeverity.error);
                return false;
            }
        }
        this.stepChallenge.stepChallengeId = 0;

        if (this.stepChallenge.leaderBoardTemplate == undefined || this.stepChallenge.leaderBoardTemplate == "undefined" || this.stepChallenge.leaderBoardTemplate == "") {
            this.loadingService.showMessage("error", "Step Challenge template is required", MessageSeverity.error);
            return false;
        }

        this.stepChallenge.startDate = this.datePipe.transform(this.bsValue, 'yyyy-MM-dd');
        this.stepChallenge.endDate = this.datePipe.transform(this.bsEndValue, 'yyyy-MM-dd');

        this.loadingService.showLoader(true);
        this.stepchallengeService.SaveStepChallenge(this.stepChallenge).subscribe(
            res => {
                if (res.status == 1) {
                    if (res.stepChallengeId > 0) {

                        this.loadingService.showMessage("success", "Step Challenge created successfully", MessageSeverity.success);
                        this.ChallengeId = res;

                        this.stepchallengeService.setStepChallenge({ Id: res.stepChallengeId, Name: this.stepChallenge.challengeName, CorporateId: this.stepChallenge.corporateId, CorporateName: this.stepChallenge.corporateName, IsSendMail: false });
                        if (this.stepChallenge.type == 1)
                            this.step = "step-challenge-enrollteams";
                        else
                            this.step = "step-challenge-enrollusers";
                    }
                }
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("warning", "This Step Challenge name is already exist.", MessageSeverity.error);
                }
                if (res.status == -3 || res.status == "-3") {
                    this.loadingService.showMessage("warning", "This directory name is already exist.", MessageSeverity.error);
                }
                if (res.status == -2 || res.status == "-2") {
                    this.loadingService.showMessage("error", "Step Challenge image not in correct formate.", MessageSeverity.error);
                }
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("error", "Step Challenge not saved with empty value.", MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveStepChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SaveStepChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    CancelStepChallenge() {
        this.router.navigate(["/challenge/add"]);
    }
}