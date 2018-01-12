import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from "@angular/router";
import swal from 'sweetalert';

import { ChallengeService } from '../../../services/challenge.service';
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
@Component({
    selector: 'team-challenge-enroll',
    templateUrl: './team-challenge-enroll.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class TeamChallengeEnrollComponent implements OnInit {
    @Input() User: any = {};
    teamChallenge: any = {};
    isExistingTeam: boolean = true;
    isMemberSearch: boolean = true;
    ChallengeTeamList: any[] = [];
    teamMemberList: any[] = [];
    isTeamEnrolled: boolean = false;
    modalRef: BsModalRef;
    MailSubject: string = "";
    MailTemplate: string = "";
    MemberEmail: string = "";
    TeamName: string = "";
    TeamDescription: string = "";
    selectedTeamFileName: any;
    selectedTeamFile: any;
    selectedFileName: any;
    selectedFile: any;
    newTeamMemberList: any[] = [];
    notAddedMember: any[] = [];
    TeamCapId: any;
    ckconfig: any = {
        height: 500
    }
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
    constructor(private router: Router, private modalService: BsModalService, private loadingService: LoadingService, private challengeService: ChallengeService, private errorLog: ErrorLogService, private ng4FilesService: Ng4FilesService) {
        this.teamChallenge = challengeService.getTeamChallenge();
    }
    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'image');
        this.ng4FilesService.addConfig(this.configImport, 'excel');
        setTimeout(() => {
            this.GetTeamList('');
            this.GetTeamEmailTemplate();
        }, 1)
    }
    GetTeamList(teamType: string) {
        this.loadingService.showLoader(true);
        this.challengeService.GetTeamList(this.teamChallenge.CorporateId, this.teamChallenge.Id, teamType).subscribe(
            res => {
                this.ChallengeTeamList = res.teamlist;
                this.isTeamEnrolled = false;
                this.ChallengeTeamList.forEach((el) => { if (el.TeamIsJoined) { this.isTeamEnrolled = true; } });
                this.isExistingTeam = res.teamtype == 'E';
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetTeamList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetTeamList").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    GetTeamEmailTemplate() {
        this.challengeService.GetTeamEmailTemplate(this.teamChallenge.CorporateId).subscribe(
            res => {
                this.MailTemplate = res.data;
                this.MailSubject = "Enroll in challenge  " + this.teamChallenge.Name;
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetTeamEmailTemplate").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetTeamEmailTemplate").subscribe(res => { }, error => { });
                }
            });
    }
    openModal(template: TemplateRef<any>, type: string, teamid: any = 0) {
        switch (type) {
            case 'view':
                this.GetTeamMemberByTeamId(template, teamid, this.isExistingTeam ? "E" : "T");
                break;
            case 'temp':
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                break;
            case 'create':
                this.clearModalData();
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                break;
        }
    }
    clearModalData() {
        this.newTeamMemberList = [];
        this.TeamCapId = 0;
        this.TeamName = "";
        this.TeamDescription = "";
        this.MemberEmail = "";
        this.selectedFile = "";
        this.selectedFileName = "";
        this.selectedTeamFile = "";
        this.selectedTeamFileName = "";
    }
    GetTeamMemberByTeamId(template: TemplateRef<any>, teamid: number, teamType: string) {
        this.loadingService.showLoader(true);
        this.challengeService.GetTeamMemberByTeamId(teamid, this.teamChallenge.Id, teamType).subscribe(
            res => {
                this.teamMemberList = res;
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetTeamMemberByTeamId").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetTeamMemberByTeamId").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    toggleTeam() {
        this.GetTeamList(this.isExistingTeam ? '' : 'T');
    }
    SaveAndEnrollTeam() {
        let teamid: any[] = [];
        this.ChallengeTeamList.forEach((el) => { if (el.TeamIsSelect) { teamid.push(el.TeamID) } });
        let teamids: string = teamid.join(',');
        if (teamid.length == 0) {
            this.loadingService.showMessage("error", "Please select atleast one team to enroll.", MessageSeverity.error);
            return;
        }
        this.loadingService.showLoader(true);
        this.challengeService.SaveAndEnrollTeam(this.teamChallenge.Id, teamids, this.isExistingTeam ? 'E' : 'T').subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("Success", res.Msg, MessageSeverity.success);
                    if (this.teamChallenge.IsSendMail) {

                        this.teamChallenge["mailTemplate"] = this.MailTemplate;
                        this.teamChallenge["mailSubject"] = this.MailSubject;
                        this.challengeService.seTeamChallenge(this.teamChallenge);
                        this.challengeService.getStep("team-send-invitation");
                    }
                    else {
                        this.router.navigate(["/challenges"]);
                    }
                }
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveAndEnrollTeam").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveAndEnrollTeam").subscribe(res => { }, error => { });
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
                    this.challengeService.RemoveTemaFromChallenge(this.teamChallenge.Id, teamid).subscribe(
                        res => {
                            this.loadingService.showLoader(false);
                            this.GetTeamList(this.isExistingTeam ? '' : 'T');
                        },
                        error => {
                            if (Utilities.checkNoNetwork(error)) {
                                this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                                this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "RemoveTeamFromChallenge").subscribe(res => { }, error => { });
                            }
                            else {
                                let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                                this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                                this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "RemoveTeamFromChallenge").subscribe(res => { }, error => { });
                            }
                            this.loadingService.showLoader(false);
                        });
                } else {
                    return;
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

        this.selectedTeamFile = Array.from(selectedFiles.files).map(file => file.name);
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedTeamFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedTeamFile = reader.result.split(',')[1];
        };
    }
    filesImportSelect(selectedFiles: Ng4FilesSelected): void {
        if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
            let errormsg = selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_COUNT_EXCEED ? "no more file added"
                : selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED ? "file size is too large"
                    : selectedFiles.status == Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS ? "only xls, csv or xlsx file is allowed" : "";
            Utilities.ShowErrorAlert("", errormsg, "error");
            return;
        }

        this.selectedFile = Array.from(selectedFiles.files).map(file => file.name);
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFile = reader.result.split(',')[1];
        };
    }
    SearchMemberByEmail() {
        if (this.MemberEmail == "")
        {
            this.loadingService.showMessage("required", "Member Email is required", MessageSeverity.info);
            return;
        }
        if (this.newTeamMemberList.find((el) => el.MemberEmail == this.MemberEmail) != undefined)
        {
            this.loadingService.showMessage("", "Member Alrady added.", MessageSeverity.info);
            return;
        }
        this.selectedFileName = "";
        this.selectedFile = "";
        this.loadingService.showLoader(true);
        this.challengeService.SearchMemberByEmail(this.teamChallenge.Id, this.teamChallenge.CorporateId, this.MemberEmail).subscribe(
            res => {
                if (res.status == 1 || res.status == "1")
                {
                    this.newTeamMemberList.push(res.MemberDetail);
                }
                if (res.status == 0 || res.status == "0")
                {
                    this.loadingService.showMessage("Error", res.Msg, MessageSeverity.error);
                }
                this.MemberEmail = "";
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SearchMemberByEmail").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SearchMemberByEmail").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    SearchMemberByExcel() {
        if (this.selectedFile == "" || this.selectedFile == undefined || this.selectedFile=="undefined") {
            this.loadingService.showMessage("required", "Excel File is required", MessageSeverity.info);
            return;
        }
        this.MemberEmail = "";
        this.loadingService.showLoader(true);
        this.challengeService.SearchMemberByExcel(this.teamChallenge.Id, this.teamChallenge.CorporateId, this.selectedFileName, this.selectedFile).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.selectedFileName = "";
                    this.selectedFile = "";
                    let allMember = this.newTeamMemberList.concat(res.added);
                    this.newTeamMemberList = allMember.filter(function (elem, index, self) {
                        return index === self.indexOf(elem);
                    });
                    this.notAddedMember = res.notAdded;
                }
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("Error", res.Msg, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SearchMemberByExcel").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SearchMemberByExcel").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    RemoveMemberFromList(index: number)
    {
        this.newTeamMemberList.splice(index, 1);
    }
    SaveTeamForChallenge() {
        if (this.selectedTeamFile == "" || this.selectedTeamFile == undefined || this.selectedTeamFile == "undefined") {
            this.loadingService.showMessage("required", "Team Image is required", MessageSeverity.info);
            return;
        }
        if (this.newTeamMemberList.length==0) {
            this.loadingService.showMessage("required", "atleast one Member is required for team", MessageSeverity.info);
            return;
        }
        let memberidarrs: any[] = [];
        this.newTeamMemberList.forEach((el) => { memberidarrs.push(el.MemberId) });
        let memberidas = memberidarrs.join(',');
        if (this.TeamCapId == 0 || this.TeamCapId == "0" || !memberidas.includes(this.TeamCapId)) {
            this.loadingService.showMessage("required", "You have not select captain to any one member for this team.", MessageSeverity.info);
            return;
        }
        this.loadingService.showLoader(true);
        this.challengeService.SaveTeamAndEnrollMembers(this.teamChallenge.Id, this.TeamName, this.TeamDescription, this.selectedTeamFile, this.selectedTeamFileName, memberidas, this.TeamCapId, this.isExistingTeam ? '' : 'T', this.User.MemberID).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.toggleTeam();
                    this.modalRef.hide();
                }
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("Error", res.Msg, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveTeamForChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveTeamForChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
}