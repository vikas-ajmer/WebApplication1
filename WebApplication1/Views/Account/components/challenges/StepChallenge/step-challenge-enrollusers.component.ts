import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
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
    selector: 'step-challenge-enrollusers',
    templateUrl: './step-challenge-enrollusers.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})

export class StepChallengeEnrollUserComponent implements OnInit {

    stepChallenge: any = {};
    IsSendMail: boolean = false;
    modalRef: BsModalRef;
    memberId: number = 0;
    action: string = "INSERT";
    MailSubject: string = "";
    MailTemplate: string = "";
    MailDisplayName: string = "The Wellness Corner";
    isExistingUsers: boolean = false;
    isUserEnrolled: boolean = false;
    step: string = "step-challenge-enrollusers";
    selectedFiles: any;
    selectedFileName: any;

    enrolledMemberList: any[] = [];
    notEnrollMemberList: any[] = [];
    totalRegisteredMembers: number = 0;
    totalEnrollCounter: number = 0;
    totalNotEnrollCounter: number = 0;

    configImport: Ng4FilesConfig = {
        acceptExtensions: ['xls', 'csv', 'xlsx'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };




    constructor(private challengeCreate: StepChallengeCreateComponent,private router: Router, private route: ActivatedRoute, private modalService: BsModalService, private challengeService: StepChallengeService, private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {
        this.memberId = parseInt(authService.currentUser.MemberID);
        this.stepChallenge = this.challengeService.getStepChallenge();
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImport, 'excel');
        setTimeout(() => {
            this.GetTeamEmailTemplate();
            this.getTotalRegisteredMembers();
            //if (this.stepChallenge.Id > 0)
            // this.getAleardyEnrolledMembers();
        }, 1)
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

    toggleIndividualUsers(type) {
        if (type == 1) { //1= already registered users
            this.isExistingUsers = true;
            if (this.stepChallenge.Id > 0)
                this.getAleardyEnrolledMembers();

            this.getTotalRegisteredMembers();
        }
        else { // 2= import from excel.
            this.isExistingUsers = false;
        }
    }

    getTotalRegisteredMembers() {
        this.challengeService.GetTotalRegisteredMembers(this.stepChallenge.CorporateId).subscribe(
            res => {
                this.totalRegisteredMembers = res;
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-getAleardyRegisteredMembers").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-getAleardyRegisteredMembers").subscribe(res => { }, error => { });
                }
            });
    }

    getAleardyEnrolledMembers() {
        this.challengeService.GetEnrolledMembersListById(this.stepChallenge.Id, this.stepChallenge.CorporateId).subscribe(
            res => {
                if (res.status == 1 || res.status == "1")
                    this.enrolledMemberList = res._enrolledMembersList;            
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-GetEnrolledMembersListById").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-GetEnrolledMembersListById").subscribe(res => { }, error => { });
                }
            });
    }

    RemoveMemberFromChallenge(memberId: number) {
        swal({
            title: "Are you sure?",
            text: "you want to remove this member from challenge!",
            icon: "warning",
            dangerMode: true,
        })
            .then((willDelete) => {
                if (willDelete) {
                    this.loadingService.showLoader(true);
                    this.challengeService.RemoveTeamOrMember(this.stepChallenge.Id, 0, memberId, 'M').subscribe( // T=Team, M= Member
                        res => {
                            this.loadingService.showLoader(false);
                            this.getAleardyEnrolledMembers();
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

    showModal(template: TemplateRef<any>, type: string) {
        switch (type) {
            case 'viewmembers':
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                break;
            case 'emailtemp':
                this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                break;
        }
    }

    EnrollAllMembers() {
        this.action = this.stepChallenge.Id > 0 ? "UPDATE" : this.action;
        this.loadingService.showLoader(true);
        this.challengeService.EnrollMembers(this.action, this.stepChallenge.CorporateId, this.stepChallenge.Id, this.MailSubject, this.MailDisplayName, this.MailTemplate, this.memberId, this.stepChallenge.IsSendMail).subscribe(
            res => {
                if (res.status == 1 || res.status == "1" || res.status == 2 || res.status == "2" || res.status == -2 || res.status == "-2") {
                    this.challengeCreate.step = "UserEnrollment-complete";
                    this.getAleardyEnrolledMembers();
                    this.loadingService.showMessage("Success", "Enrollment successfull!.", MessageSeverity.success);
                }
                else {
                    this.loadingService.showMessage("Error", "", MessageSeverity.error);
                }

                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-EnrollMembers").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-EnrollMembers").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }


    EnrollMemberByExcel() {
        if (this.selectedFiles == "" || this.selectedFiles == undefined || this.selectedFiles == "undefined") {
            this.loadingService.showMessage("required", "Excel File is required", MessageSeverity.info);
            return;
        }
        this.action = this.stepChallenge.Id > 0 ? "UPDATE" : this.action;

        this.loadingService.showLoader(true);
        this.challengeService.EnrollMemberByExcel(this.action, this.stepChallenge.CorporateId, this.stepChallenge.Id, this.selectedFiles, this.selectedFileName, this.MailSubject, this.MailDisplayName, this.MailTemplate, this.memberId, this.stepChallenge.IsSendMail).subscribe(
            res => {
                if (res.status == 0 || res.status == "0") {
                    this.selectedFileName = ""; this.selectedFiles = "";
                    this.enrolledMemberList = res._enrolledMembersList;

                    this.notEnrollMemberList = res._dtNotAvailMembersList;

                    this.totalEnrollCounter = res.insertCounter;
                    this.totalNotEnrollCounter = this.notEnrollMemberList.length;
                    this.challengeCreate.step = "UserEnrollment-complete";
                    this.loadingService.showMessage("Success", "Enrollment successfull!.", MessageSeverity.success);
                }
                if (res.status == -1 || res.status == "-1") {
                    this.selectedFileName = ""; this.selectedFiles = "";
                    this.notEnrollMemberList = res._dtNotAvailMembersList;
                    this.totalNotEnrollCounter = this.notEnrollMemberList.length;
                    this.step = "enroll-complete";
                    this.loadingService.showMessage("Success", "Enrollment successfull!.", MessageSeverity.success);
                }

                if (res.status == -2 || res.status == "-2" || res.status == -3 || res.status == "-3") {
                    this.loadingService.showMessage("Error", "Email header not exist or sheet/data not exist in file.", MessageSeverity.error);
                }

                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "StepChallenge-EnrollMemberByExcel").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "StepChallenge-EnrollMemberByExcel").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    GoToListPage() {
        this.router.navigate(["/challenge/add"]);
    }
}