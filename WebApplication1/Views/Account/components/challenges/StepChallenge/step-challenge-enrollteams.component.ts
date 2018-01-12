import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
var swal: any = require('sweetalert');

import { StepChallengeCreateComponent } from '../../../components/challenges/StepChallenge/step-challenge-create.component';
import { StepChallengeService } from '../../../services/step-challenge.service';
import { AuthService } from "../../../services/auth.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';


@Component({
    selector: 'step-challenge-enrollteams',
    templateUrl: './step-challenge-enrollteams.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})

export class StepChallengeEnrollTeamComponent implements OnInit {

    memberID: number;
    challengeTeamList: any[] = [];
    stepChallenge: any = {};
    isMemberSearch: boolean = true;
    isTeamEnrolled: boolean = false;
    isExistingTeam: boolean = false;
    IsSendMail: boolean = false;
    modalRef: BsModalRef;
    step: string = "step-challenge-enrollteams";
    teamMemberList: any[] = [];
    MailSubject: string = "";
    MailTemplate: string = "";
    MailDisplayName: string = "The Wellness Corner";
    searchMemberEmail: string = "";

    clsClass: string = "active";
    isStepComplete: boolean = false;

    TeamName: string = "";
    TeamDescription: string = "";
    selectedTeamFileName: any;
    selectedTeamFile: any;
    selectedFiles: any;
    selectedFileName: any;
    newTeamMemberList: any[] = [];;
    _notAddedMember: any[] = [];
    TeamCaptainId: any;
    ckconfig: any = {
        height: 500
    }
    isSelectAllTeam: boolean = false;
    isAllSelected: boolean = false;

    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };
    configImport: Ng4FilesConfig = {
        acceptExtensions: ['xls', 'csv', 'xlsx'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };

    constructor(private challengeCreate: StepChallengeCreateComponent, private modalService: BsModalService, private challengeService: StepChallengeService, private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {
        this.memberID = parseInt(authService.currentUser.MemberID);
        this.stepChallenge = this.challengeService.getStepChallenge();
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.ng4FilesService.addConfig(this.configImport, 'excel');

        setTimeout(() => {
            this.getTeamList('');
            this.GetTeamEmailTemplate();
        }, 1)
    }

    filesImportSelect(selectedFiles: Ng4FilesSelected): void {
        if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
            let errormsg = selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_COUNT_EXCEED ? "no more file added"
                : selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED ? "file size is too large"
                    : selectedFiles.status == Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS ? "only xls, csv or xlsx file is allowed" : "";
            Utilities.ShowErrorAlert("", errormsg, "error");
            return;
        }

        this.selectedFiles = Array.from(selectedFiles.files).map(file => file.name);
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
        };
    }

    filesSelect(selectedFiles: Ng4FilesSelected): void {

        if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
            let errormsg = selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_COUNT_EXCEED ? "no more file added"
                : selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED ? "file size is too large"
                    : selectedFiles.status == Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS ? "only jpg,jpeg or png file is allowed" : "";
            Utilities.ShowErrorAlert("", errormsg, "error");
            return;
        }

        this.selectedTeamFile = Array.from(selectedFiles.files).map(file => file.name);
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedTeamFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedTeamFile = reader.result.split(',')[1];
        };
    }

    GetTeamEmailTemplate() {
        this.challengeService.GetTeamEmailTemplate(this.stepChallenge.Id).subscribe(
            res => {
                this.MailTemplate = res.data;
                this.MailSubject = "Enroll in step challenge  " + this.stepChallenge.Name;
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-GetTeamEmailTemplate").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-GetTeamEmailTemplate").subscribe(res => { }, error => { });
                }
            });
    }

    getTeamList(teamType: string) {
        this.loadingService.showLoader(true);
        this.challengeService.GetTeamList(this.stepChallenge.CorporateId, this.stepChallenge.Id, teamType).subscribe(
            res => {
                this.challengeTeamList = res.teamlist;
                this.isTeamEnrolled = false;
                this.challengeTeamList.forEach((el) => { if (el.TeamIsJoined) { this.isTeamEnrolled = true; } });
                this.isExistingTeam = res.teamtype == 'E';
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-GetTeamList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-GetTeamList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    clearPopupData() {
        this.newTeamMemberList = [];
        this._notAddedMember = [];
        this.TeamCaptainId = 0;
        this.TeamName = "";
        this.TeamDescription = "";
        this.searchMemberEmail = "";
        this.selectedFiles = "";
        this.selectedFileName = "";
        this.selectedTeamFile = "";
        this.selectedTeamFileName = "";
    }


    GetTeamMemberByTeamId(template: TemplateRef<any>, teamid: number, teamType: string) {
        this.loadingService.showLoader(true);
        this.challengeService.GetTeamMemberByTeamId(teamid, this.stepChallenge.Id, teamType).subscribe(
            res => {
                this.teamMemberList = res;
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-GetTeamMemberByTeamId").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-GetTeamMemberByTeamId").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    toggleTeamList() {
        this.getTeamList(this.isExistingTeam ? '' : 'S');
    }

    // Select All Teams.
    SelectAll(type: string, flag: boolean) {
        this.isAllSelected = false;
        if (type == "ALL") {
            this.challengeTeamList.forEach((el) => { el.TeamIsSelect = this.isSelectAllTeam; });
        }
        else {
            if (!flag)
                this.isSelectAllTeam = false;
            else {
                this.challengeTeamList.forEach((el) => { if (el.TeamIsSelect == false) { this.isAllSelected = true; } })
                if (!this.isAllSelected)
                    this.isSelectAllTeam = true;
            }
        }
    }

    RemoveMemberFromList(index: number) {
        this.newTeamMemberList.splice(index, 1);
    }

    SearchMemberByEmail() {
        this.searchMemberEmail = ((document.getElementById("searchMemberEmail") as HTMLInputElement).value);
        if (this.searchMemberEmail == "") {
            this.loadingService.showMessage("required", "Member Email is required", MessageSeverity.info);
            return;
        }
        if (this.newTeamMemberList.find((el) => el.MemberEmail == this.searchMemberEmail) != undefined) {
            this.loadingService.showMessage("", "Member Alrady added.", MessageSeverity.info);
            return;
        }
        this.selectedFileName = "";
        this.selectedFiles = "";
        this.loadingService.showLoader(true);

        this.challengeService.SearchMemberByEmail(this.stepChallenge.Id, this.stepChallenge.CorporateId, this.searchMemberEmail).subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.newTeamMemberList.push(res.MemberDetail);
                    console.log(this.newTeamMemberList)
                }
                else if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("info", "this member not available.", MessageSeverity.error);
                }
                else if (res.status == 2 || res.status == "2") {
                    this.loadingService.showMessage("info", "this member already joined a team.", MessageSeverity.error);
                }
                else {
                    this.loadingService.showMessage("error", res.Msg, MessageSeverity.error);
                }
                this.searchMemberEmail = "";
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-SearchMemberByEmail").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-SearchMemberByEmail").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    SearchMemberByExcel() {
        if (this.selectedFiles == "" || this.selectedFiles == undefined || this.selectedFiles == "undefined") {
            this.loadingService.showMessage("required", "Excel File is required", MessageSeverity.info);
            return;
        }
        this.searchMemberEmail = "";
        this.loadingService.showLoader(true);
        this.challengeService.SearchMemberByExcel(this.stepChallenge.Id, this.stepChallenge.CorporateId, this.selectedFileName, this.selectedFiles).subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.selectedFileName = "";
                    this.selectedFiles = "";
                    let allMember = this.newTeamMemberList.concat(res._foundMembersList);
                    this.newTeamMemberList = allMember.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                    this._notAddedMember = res._dtNotAvailMembersList;
                }
                if (res.status == -2 || res.status == "-2" || res.status == -3 || res.status == "-3") {
                    this.loadingService.showMessage("Error", "Email header not exist or sheet/data not exist in file.", MessageSeverity.error);
                }

                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("Error", res.Msg, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-SearchMemberByExcel").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-SearchMemberByExcel").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    showModal(template: TemplateRef<any>, type: string, teamid: any = 0) {
        switch (type) {
            case 'viewteam':
                this.GetTeamMemberByTeamId(template, teamid, this.isExistingTeam ? "E" : "S");
                break;
            case 'emailtemp':
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                break;
            case 'createteam':
                this.clearPopupData();
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                break;
        }
    }

    // Save new teams with their team members for step challenge.
    SaveTeamForChallenge() {
        if (this.selectedTeamFile == "" || this.selectedTeamFile == undefined || this.selectedTeamFile == "undefined") {
            this.loadingService.showMessage("required", "Team Image is required", MessageSeverity.info);
            return;
        }
        if (this.newTeamMemberList.length == 0) {
            this.loadingService.showMessage("required", "atleast one Member is required for team", MessageSeverity.info);
            return;
        }

        let _memberidList: any[] = [];
        this.newTeamMemberList.forEach((el) => { _memberidList.push(el.MemberId) });
        let memberIDs = _memberidList.join(',');

        if (this.TeamCaptainId == 0 || this.TeamCaptainId == "0" || !memberIDs.includes(this.TeamCaptainId)) {
            this.loadingService.showMessage("required", "You have not select captain to any one member for this team.", MessageSeverity.info);
            return;
        }

        this.loadingService.showLoader(true);
        this.challengeService.SaveTeamAndEnrollMembers(this.stepChallenge.Id, this.TeamName, this.TeamDescription, this.selectedTeamFile, this.selectedTeamFileName, memberIDs, this.TeamCaptainId, this.isExistingTeam ? '' : 'S', this.memberID).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.toggleTeamList();
                    this.modalRef.hide();
                }
                if (res.status == -2 || res.status == "-2") {
                    this.loadingService.showMessage("Error", "This team name alredy exist.", MessageSeverity.error);
                }
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("Error", "Team not saved.", MessageSeverity.error);
                }

                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-SaveTeamForChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-SaveTeamForChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    SaveAndEnrollTeam() {

        let teamid: any[] = [];
        this.challengeTeamList.forEach((el) => { if (el.TeamIsSelect) { teamid.push(el.TeamID) } });
        let teamids: string = teamid.join(',');
        if (teamid.length == 0) {
            this.loadingService.showMessage("error", "Please select atleast one team to enroll.", MessageSeverity.error);
            return;
        }
        this.loadingService.showLoader(true);
        this.challengeService.SaveAndEnrollTeam(this.stepChallenge.Id, teamids, this.isExistingTeam ? 'E' : 'S', this.MailSubject, this.MailDisplayName, this.MailTemplate, this.stepChallenge.IsSendMail).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.challengeCreate.step = "TeamEnrollment-complete";
                    this.loadingService.showMessage("Success", "Enrollment Successfull!", MessageSeverity.success);
                }
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-SaveAndEnrollTeam").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-SaveAndEnrollTeam").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    RemoveTeamFromChallenge(teamid: number) {
        swal({
            title: "Are you sure?",
            text: "you want to remove this team from challenge!",
            icon: "warning",
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.loadingService.showLoader(true);
                    this.challengeService.RemoveTeamOrMember(this.stepChallenge.Id, teamid, 0, 'T').subscribe( // T=Team, M= Member
                        res => {
                            this.loadingService.showLoader(false);
                            this.getTeamList(this.isExistingTeam ? '' : 'S');
                        },
                        error => {
                            if (Utilities.checkNoNetwork(error)) {
                                this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                                this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-RemoveTeamOrMember").subscribe(res => { }, error => { });
                            }
                            else {
                                let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                                this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                                this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-RemoveTeamOrMember").subscribe(res => { }, error => { });
                            }
                            this.loadingService.showLoader(false);
                        });
                } else {
                    return;
                }
            });
    }

}