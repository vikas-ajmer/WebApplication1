import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { Router } from "@angular/router";

import { ChallengeService } from '../../../services/challenge.service';
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { CorporateChallenge } from "../../../models/challenge.model";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
@Component({
    selector: 'individual-challenge',
    templateUrl: './individual-challenge-detail.component.html',
    styleUrls: ['./individual-challenge-detail.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class IndividualChallengeComponent implements OnInit {
    @Input() User: any = {};
    @Input() ChallengeId: any = 0;
    @Input() ChallengeCounting: any[] = [];
    @Input() corporateList: any[] = [];
    isLogoUpdate: boolean = false;
    challengeType: any;
    searchTag: any[] = [];
    corporateMSSettings: any;
    selectedCorporateItems: any[] = [];
    selectedSearchTags: any[] = [];
    ImgUrl: any = "";
    selectedFiles: any;
    selectedFileName: any;
    rdblstChallengeCategory: number = 1;
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };
    corporateChallenge = new CorporateChallenge(0, 0, "", "", 1, 0, "", "", "", 0, "", "", "", "", 0, 0, "", "", "", "", false, true, "");
    constructor(private router: Router, private loadingService: LoadingService, private challengeService: ChallengeService, private errorLog: ErrorLogService, private ng4FilesService: Ng4FilesService) {

    }
    ngOnInit() {
        this.corporateMSSettings = {
            singleSelection: false,
            showCheckbox: true,
            text: "Select Corporate",
            classes: "multiselect-corporate"
        };
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.corporateChallenge.MemberId = this.User.MemberID;
        setTimeout(() => {
            this.getSearchTag();
        }, 1);
        setTimeout(() => {
            this.getIndividualChallenge(this.ChallengeId);
        }, 100);
    }
    getIndividualChallenge(Id: any) {
        this.loadingService.showLoader(true);
        this.challengeService.GetIndividualChallenge(Id).subscribe(
            res => {
                this.corporateChallenge = res.Data;
                this.ImgUrl = res.imagePath;
                this.rdblstChallengeCategory = this.corporateChallenge.rdblstChallengeCategory == "Counting Something" ? 0 : 1;
                this.corporateChallenge.CorporateList = res.SelectedCorporateIds;
                if (this.corporateChallenge.CorporateList != "") {
                    for (let item of this.corporateChallenge.CorporateList.split(',')) {
                        this.selectedCorporateItems.push(this.corporateList.find((obj) => obj.id == item));
                    }
                }
                setTimeout(() => {
                    if (this.corporateChallenge.ChallengeTags != "") {
                        for (let item of this.corporateChallenge.ChallengeTags.split(',')) {
                            this.selectedSearchTags.push(this.searchTag.find((obj) => obj.id == item));
                        }
                    }
                }, 1000);
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getIndividualChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getIndividualChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    getSearchTag() {
        this.challengeService.getSearchTag().subscribe(
            res => {
                this.searchTag = res;
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "getSearchTag").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "getSearchTag").subscribe(res => { }, error => { });
                }
            });
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
        this.corporateChallenge.ImageName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
            this.corporateChallenge.Image = this.selectedFiles;
        };
    }
    SaveIndividualChallenge() {
        if (this.corporateChallenge.ChallengeImage==""&&(this.selectedFiles == undefined || this.selectedFiles == "undefined" || this.selectedFiles == "")) {
            this.loadingService.showMessage("error", "challenge image is required", MessageSeverity.error);
            return false;
        }
        if (this.rdblstChallengeCategory == 1) {
            if (this.corporateChallenge.Completions <= this.corporateChallenge.ChallengeDuration) {
                if (this.corporateChallenge.Selectfrequency == 3) {
                    var week = Math.ceil(this.corporateChallenge.ChallengeDuration / 7);
                    if (this.corporateChallenge.Completions > week) {
                        this.loadingService.showMessage("error", "Maximum completion thershold (weekly check-in frequency) can be: " + week, MessageSeverity.error);
                        return false;
                    }
                }
            }
            else {
                this.loadingService.showMessage("error", "Completion thershold not be greater than Challenge Duration ", MessageSeverity.error);
                return false;
            }
            if (this.corporateChallenge.Desiredanswer == this.corporateChallenge.AlternateAnswer) {
                this.loadingService.showMessage("error", "Desired & Alternate answer must not be same", MessageSeverity.error);
                return false;
            }
        }
        if (!this.corporateChallenge.IsAllCorporate) {
            let corporate: any[] = [];
            this.selectedCorporateItems.forEach((el) => { corporate.push(el.id) });
            this.corporateChallenge.CorporateList = corporate.join(',');
        }
        else {
            this.selectedCorporateItems = [];
            this.corporateChallenge.CorporateList = "";
        }
        let tag: any[] = [];
        this.selectedSearchTags.forEach((el) => { tag.push(el.id) });
        this.corporateChallenge.ChallengeTags = tag.join(',');
        this.corporateChallenge.rdblstChallengeCategory = this.rdblstChallengeCategory == 1 ? "Answering A Question" : "Counting Something";
        this.loadingService.showLoader(true);
        this.challengeService.SaveIndividualChallenge(this.corporateChallenge).subscribe(
            res => {
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showStickyMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status == 0 || res.status == "0") {
                    if (this.corporateChallenge.Challenge_IsPrivateAudience) {
                        this.challengeService.setIndividualChallenge({ Id: res.Data.Challenge_ID, Name: res.Data.Challenge_Name, IsPrivateAudience: this.corporateChallenge.Challenge_IsPrivateAudience, IsAllCorporate: this.corporateChallenge.IsAllCorporate, CorporateList: this.corporateChallenge.CorporateList });
                        this.challengeService.getStep("individual-enroll");
                    }
                    else {
                        this.router.navigate(["/challenges"]);
                    }
                    this.loadingService.showMessage("success", res.Msg, MessageSeverity.success);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveIndividualChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveIndividualChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
}
