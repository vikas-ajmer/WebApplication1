import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { ChallengeService } from '../../../services/challenge.service';
import { AdventureService } from '../../../services/adventure.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { AuthService } from "../../../services/auth.service";
import { AdventureChallenge, AdventureCorporateModel } from '../../../models/challenge.model';
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';

@Component({
    selector: 'assigncorporate-enrollteams',
    styleUrls: [],
    templateUrl: './assigncorporate-enrollteams.component.html',
    encapsulation: ViewEncapsulation.None,
    providers: [AdventureService]
})
export class AssignCorporateEnrollTeamsComponent implements OnInit {

    isExistingTeam: boolean = true;
    isTeamEnrolled: boolean = false;
    teamMemberNo: number;
    corporateID: number = -1;
    ChallengeTeamList: any = [];
    teamMemberList: any[] = [];
    selectCorporateName: string;
    userID: number = 0;
    modalRef: BsModalRef;

    isMemberSearch: boolean = true;
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

    IsSendMail: boolean = false;
    isUpdate: string = "INSERT";
    
    public adventureChallenge = new AdventureChallenge(0, "", "", 0, 0, 0, 0, "", "", false, 0, "", "", "", 0);
    public adventureCorporateModel = new AdventureCorporateModel(0, 0, 0, null, null, 0, null, 0, true, "", "");


    constructor(private router: Router, private modalService: BsModalService, private route: ActivatedRoute, private challengeService: ChallengeService,
        private adventureService: AdventureService, private errorLog: ErrorLogService, private loadingService: LoadingService,
        private authService: AuthService, private ng4FilesService: Ng4FilesService) {
                
        let routeParams = this.route.snapshot.paramMap;
        let adventureID = routeParams.get('adventureid');
        let ACorporate_ID = parseInt(routeParams.get('acorporate_id'));

        this.adventureChallenge.Id = ACorporate_ID;
        this.adventureService.getUserCorporateId(this.adventureChallenge).subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("error", res.Msg, MessageSeverity.error);
                }
                else {
                    this.adventureChallenge.UserCorporateID = res.corporateId;
                    this.MailTemplate = res.template;
                    this.getTeamsList('');
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
    }
    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'image');
        this.ng4FilesService.addConfig(this.configImport, 'excel');
        //setTimeout(() => {
        //    this.getTeamsList('');
        //    this.GetTeamEmailTemplate();
        //}, 1)
    }
    GetTeamEmailTemplate() {
        this.adventureService.GetTeamEmailTemplate(this.adventureChallenge.Id).subscribe(
            res => {
                this.MailTemplate = res.data;
                this.MailSubject = "Enroll in challenge  " + "";
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetTeamEmailTemplate").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "GetTeamEmailTemplate").subscribe(res => { }, error => { });
                }
            });
    }
    getTeamsList(teamtype: string) {
        this.loadingService.showLoader(true);
        this.adventureService.getAllTeamsList(this.adventureChallenge, teamtype).subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("error", res.Msg, MessageSeverity.error);
                }
                else {
                    this.ChallengeTeamList = res.teamList;
                    this.isExistingTeam = res.teamtype == 'E';
                    this.isTeamEnrolled = false;
                    this.ChallengeTeamList.forEach((el) => { if (el.TeamIsJoined) { this.isTeamEnrolled = true; } });

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
        this.isMemberSearch = true;
    }
    GetTeamMemberByTeamId(template: TemplateRef<any>, teamid: number, teamType: string) {
        this.loadingService.showLoader(true);
        this.challengeService.GetTeamMemberByTeamId(teamid, this.adventureChallenge.Id, teamType).subscribe(
            res => {
                this.teamMemberList = res;
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetTeamMemberByTeamId").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "GetTeamMemberByTeamId").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    toggleTeam() {
        this.getTeamsList(this.isExistingTeam ? 'E' : 'A');
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
        this.adventureService.EnrollTeamWithAdventure(this.adventureChallenge.Id, teamids, this.isExistingTeam ? 'E' : 'A','UPDATE').subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.loadingService.showMessage("Success", res.Msg, MessageSeverity.success);
                    this.getTeamsList(this.isExistingTeam ? 'E' : 'A');
                }
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                    if (this.IsSendMail == true) {
                        this.SendEmailToEnrolledMembers();
                    }
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveAndEnrollTeam").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SaveAndEnrollTeam").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });        
        
    }
    RemoveTeamFromChallenge(teamid: number) {
        swal({
            title: "Are you sure?",
            text: "you want to remove this team from adventure!",
            icon: "warning",
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.loadingService.showLoader(true);
                    this.adventureService.RemoveTemaFromChallenge(this.adventureChallenge.Id, teamid).subscribe(
                        res => {
                            this.loadingService.showLoader(false);
                            this.getTeamsList(this.isExistingTeam ? 'E' : 'A');
                        },
                        error => {
                            this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                            if (Utilities.checkNoNetwork(error)) {
                                this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "RemoveTeamFromChallenge").subscribe(res => { }, error => { });
                            }
                            else {
                                let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                                this.errorLog.WriteError(errorMessage, "RemoveTeamFromChallenge").subscribe(res => { }, error => { });
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
        if (this.MemberEmail == "") {
            this.loadingService.showMessage("required", "Member Email is required", MessageSeverity.info);
            return;
        }
        if (this.newTeamMemberList.find((el) => el.MemberEmail == this.MemberEmail) != undefined) {
            this.loadingService.showMessage("", "Member Alrady added.", MessageSeverity.info);
            return;
        }
        this.selectedFileName = "";
        this.selectedFile = "";
        this.loadingService.showLoader(true);
        this.adventureService.SearchMemberByEmail(this.adventureChallenge.Id, this.adventureChallenge.UserCorporateID, this.MemberEmail).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.newTeamMemberList.push(res.MemberDetail);
                }
                if (res.status == 0 || res.status == "0") {
                    this.loadingService.showMessage("Error", res.Msg, MessageSeverity.error);
                }
                this.MemberEmail = "";
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SearchMemberByEmail").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SearchMemberByEmail").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    SearchMemberByExcel() {
        if (this.selectedFile == "" || this.selectedFile == undefined || this.selectedFile == "undefined") {
            this.loadingService.showMessage("required", "Excel File is required", MessageSeverity.info);
            return;
        }
        this.MemberEmail = "";
        this.loadingService.showLoader(true);
        this.adventureService.SearchMemberByExcel(this.adventureChallenge.Id, this.adventureChallenge.UserCorporateID, this.selectedFileName, this.selectedFile).subscribe(
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
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SearchMemberByExcel").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SearchMemberByExcel").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    RemoveMemberFromList(index: number) {
        this.newTeamMemberList.splice(index, 1);
    }
    SaveTeamForChallenge() {
        if (this.selectedTeamFile == "" || this.selectedTeamFile == undefined || this.selectedTeamFile == "undefined") {
            this.loadingService.showMessage("required", "Team Image is required", MessageSeverity.info);
            return;
        }
        if (this.newTeamMemberList.length == 0) {
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
        this.adventureService.SaveTeamAndEnrollMembers(this.adventureChallenge.Id, this.TeamName, this.TeamDescription, this.selectedTeamFile, this.selectedTeamFileName, memberidas, this.TeamCapId, this.isExistingTeam ? '' : 'A', this.authService.currentUserId).subscribe(
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
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveTeamForChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SaveTeamForChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    SendEmailToEnrolledMembers() {
        if (this.MailSubject == "" || this.MailSubject == undefined || this.MailSubject == "undefined") {
            this.loadingService.showMessage("", "Mail subject is required.", MessageSeverity.info);
            return;
        }
        if (this.MailTemplate == "" || this.MailTemplate == undefined || this.MailTemplate == "undefined") {
            this.loadingService.showMessage("", "Mail template is required.", MessageSeverity.info);
            return;
        }
        else {
            console.log(this.adventureChallenge.Id, this.authService.currentUserId, this.MailSubject, "The Wellness Corner");
            this.loadingService.showLoader(true);
            this.adventureService.SendEmailToEnrolledTeamMember(this.adventureChallenge.Id, this.authService.currentUserId, this.MailSubject, "The Wellness Corner", this.MailTemplate).subscribe((res: any) => {
                if (res.status == 1 || res.status == "1") {
                    this.loadingService.showMessage("Success", res.Msg, MessageSeverity.success);
                    this.router.navigate(["/challenges"]);
                }
                if (res.status == 0 || res.status == "0") {
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