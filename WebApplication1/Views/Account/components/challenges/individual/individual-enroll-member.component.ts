import { Component, OnInit, ViewEncapsulation, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
import { ChallengeService } from '../../../services/challenge.service';
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
@Component({
    selector: 'individual-enroll-member',
    templateUrl: './individual-enroll-member.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class IndividualEnrollMemberComponent implements OnInit {
    individualChallenge: any;
    memberEmail: string = "";
    isEnrollByExcel: boolean = false;
    ExcelFile: string = "";
    ExcelFileName: string = "";
    @Input() User: any = {};
    EnrolledMembers: any[] = [];
    memberNotFoundList: any[] = [];
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['xls', 'csv', 'xlsx'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };
    modalRef: BsModalRef;
    MailSubject: string = "";
    MailTemplate: string = "";
    ckconfig: any = {
        height: 500
    }
    constructor(private modalService: BsModalService,private loadingService: LoadingService, private challengeService: ChallengeService, private errorLog: ErrorLogService, private ng4FilesService: Ng4FilesService) {
    }
    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.individualChallenge = this.challengeService.getIndividualChallenge();
        setTimeout(() => {
            this.GetEnrolledMember();
            this.GetEmailTemplate();
        }, 10);
    }
    GetEmailTemplate(): void {
        this.challengeService.GetEmailTemplate(this.individualChallenge.Id).subscribe(
            res => {
                this.MailTemplate = res.data;
                this.MailSubject = "Enroll in challenge  " + this.individualChallenge.Name;
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetEmailTemplate").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetEmailTemplate").subscribe(res => { }, error => { });
                }
            });
    }
    GetEnrolledMember(): void {
        this.loadingService.showLoader(true);
        this.challengeService.GetEnrolledMember(this.individualChallenge.Id).subscribe(
            res => {
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status == 0 || res.status == "0") {
                    this.EnrolledMembers = res.Data;
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetEnrolledMember").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetEnrolledMember").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    filesSelect(selectedFiles: Ng4FilesSelected): void {
        if (selectedFiles.status !== Ng4FilesStatus.STATUS_SUCCESS) {
            let errormsg = selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILES_COUNT_EXCEED ? "no more file added"
                : selectedFiles.status == Ng4FilesStatus.STATUS_MAX_FILE_SIZE_EXCEED ? "file size is too large"
                    : selectedFiles.status == Ng4FilesStatus.STATUS_NOT_MATCH_EXTENSIONS ? "only xls,csv or xlxs file is allowed" : "";
            this.loadingService.showMessage("error", errormsg, MessageSeverity.error);
            return;
        }
        
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.ExcelFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.ExcelFile = reader.result.split(',')[1];
        };
    }
    RemoveEnrolledMember(challengeId:any,MemberId:any): void {
        this.loadingService.showLoader(true);
        this.challengeService.RemoveMemberFromChallenge(challengeId, MemberId).subscribe(
            res => {
                this.GetEnrolledMember();
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "RemoveEnrolledMember").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "RemoveEnrolledMember").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    EnrollToChallenge(): void {
        if (this.memberEmail != "" && !this.isEnrollByExcel) {
            this.ExcelFile = "";
            this.ExcelFileName = "";
            this.EnrollMemberByExcelOrEmail();
        }
        else if (this.ExcelFile != "" && this.isEnrollByExcel) {
            this.memberEmail = "";
            this.EnrollMemberByExcelOrEmail();
        }
        else
        {
            let Msg: any = this.memberEmail == "" ? "Member Email Is Required." : "Excel File is required.";
            this.loadingService.showMessage("error", Msg, MessageSeverity.error);
        }
    }
    EnrollMemberByExcelOrEmail(): void {
        this.loadingService.showLoader(true);
        this.challengeService.EnrollMemberToChallenge(this.individualChallenge.Id, this.User.MemberID, this.individualChallenge.IsPrivateAudience, this.individualChallenge.IsAllCorporate, this.memberEmail, this.individualChallenge.CorporateList, this.ExcelFile, this.ExcelFileName).subscribe(
            res => {
                console.log(res);
                if (res.status == -1 || res.status == "-1")
                {
                    this.loadingService.showMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status == 0 || res.status == "0")
                {
                    this.EnrolledMembers = res.EnrolledMember;
                    if (res.memberNotFoundList != undefined && res.memberNotFoundList != "undefined")
                    {
                        this.memberNotFoundList = res.memberNotFoundList;
                    }
                    this.loadingService.showMessage("succss", res.Msg, MessageSeverity.success);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "EnrollMemberByExcelOrEmail").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "EnrollMemberByExcelOrEmail").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    openSendEmailModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class: 'modal-lg' });
    }

    GotoSendInvitation(): void {
        this.individualChallenge["mailTemplate"] = this.MailTemplate;
        this.individualChallenge["mailSubject"] = this.MailSubject;
        this.individualChallenge["TotalMember"] = this.EnrolledMembers.length;
        this.challengeService.setIndividualChallenge(this.individualChallenge);
        this.challengeService.getStep("individual-sendinvitation");
    }
}
