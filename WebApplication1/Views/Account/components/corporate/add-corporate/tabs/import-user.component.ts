import { Component, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../../directives/file-upload/index';
import { CorporateService } from '../../../../services/corporate.service';
import { ErrorLogService } from "../../../../services/error.log.service";
import { Utilities } from "../../../../services/Utilities";
import { LoadingService, MessageSeverity } from "../../../../services/loader.service";
import { AuthService } from "../../../../services/auth.service";
import { Constants } from "../../../../services/constants";
import { CorporateBasicDetails } from "../../../../models/corporate.model";
@Component({
    selector: 'import-user',
    templateUrl: './import-user.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class ImportuserComponent implements OnInit {
    corporate: any;
    IsCorporateEmpAdd: boolean = false;
    totalEmployeeRegistered: number = 0;
    registrationLimit: number = 0;
    selectedFiles: any;
    selectedFileName: any = " ";
    isUserImported: boolean = false;
    wrongEmail: any;
    duplicateEmail: any;
    importedMember: any;
    notRegistered: any;
    upfile: string[] = [];
    ImportEmail: string[] = [];
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['xls', 'csv', 'xlsx'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };
    modalRef: BsModalRef;
    MailSubject: string = "";
    MailDisplayName: string = "";
    MailTemplate: string = "";
    ckconfig: any = {
        height: 300
    }
    constructor(private modalService: BsModalService, private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.corporate = this.corporateService.getNewCorporate();
        this.IsCorporateEmpAdd = this.corporateService.getCorporateIsEmpAdd();
        setTimeout(() => {
            this.getTotalAndLimitByCorporateInfoId();
        }, 200);
    }

    getTotalAndLimitByCorporateInfoId() {
        this.corporateService.getTotalAndLimitByCorporateInfoId(this.corporate.CorporateInfoID | 0).subscribe((res: any) => {
            this.totalEmployeeRegistered = res.TotalMember;
            this.registrationLimit = res.Limit;
        }, error => {
            console.log(error);
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

        this.selectedFiles = Array.from(selectedFiles.files).map(file => file.name);
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
            this.upfile.push(this.selectedFiles);
        };
    }
    SaveImportUser(): void {
        if (this.selectedFiles != null && this.selectedFiles != undefined && this.selectedFiles != 'undefined') {
            this.loadingService.showLoader(true);
            this.corporateService.SaveImportUser(this.selectedFiles, this.corporate.CorporateInfoID).subscribe((res: any) => {
                if (res.status == -1) {
                    this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                    this.loadingService.showLoader(false);
                    return false;
                }
                else if (res.status == 0) {
                    this.selectedFiles = null;
                    this.wrongEmail = res.wrongemail;
                    this.duplicateEmail = res.doubleobject;
                    this.importedMember = res.insertedMembers;
                    this.notRegistered = res.getemailfromdb;
                    this.ImportEmail = res.ImportEmail;
                    this.isUserImported = true;
                    this.loadingService.showLoader(false);
                }
                this.loadingService.showLoader(false);
            }, error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveImportUser").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveImportUser").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
        }
        else {
            this.loadingService.showMessage("required", "Excel file is required", MessageSeverity.error);
        }
    }

    SaveWrongEmailUserAgain(): void {
        this.loadingService.showLoader(true);
        this.corporateService.SaveImportUser(this.selectedFiles, this.corporate.CorporateInfoID, this.wrongEmail).subscribe((res: any) => {
            if (res.status == -1) {
                this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                this.loadingService.showLoader(false);
                return false;
            }
            else if (res.status == 0) {
                this.wrongEmail = res.wrongemail;
                this.importedMember = this.importedMember+res.insertedMembers;
                this.notRegistered = this.notRegistered.concat(res.getemailfromdb);
                this.ImportEmail = this.ImportEmail.concat(res.ImportEmail);
                this.isUserImported = true;
                this.loadingService.showLoader(false);
            }
            this.loadingService.showLoader(false);
        }, error => {
            if (Utilities.checkNoNetwork(error)) {
                this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveWrongEmailUserAgain").subscribe(res => { }, error => { });
            }
            else {
                let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveWrongEmailUserAgain").subscribe(res => { }, error => { });
            }
            this.loadingService.showLoader(false);
        });
    }

    GoToStep(step: string): void {
        this.corporateService.getStep(step);
    }
    openSendEmailModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, {class:'modal-lg'});
    }
    SendEmailToImportUser(): void {
        if (this.MailTemplate == "" || this.MailTemplate == undefined || this.MailTemplate == "undefined") {
            this.loadingService.showMessage("", "Mail template is required.", MessageSeverity.info);
            return ;
        }
        else {
            this.loadingService.showLoader(true);
            this.corporateService.SendMailToImportUser(this.MailTemplate, this.MailSubject, this.ImportEmail, this.MailDisplayName, this.corporate.CorporateInfo_Name, this.authService.currentUserId, this.corporate.CorporateInfoID).subscribe((res: any) => {
                this.modalRef.hide();
                this.ImportEmail = [];
                this.loadingService.showMessage("Success", "Mail send Successfully", MessageSeverity.success);
                this.loadingService.showLoader(false);
            }, error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SendEmailToImportUser").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SendEmailToImportUser").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
        }
    }

    RemoveWrongEmail(data: any): void {
        let find: boolean = false;
        let index: number = 0;
        for (let item of this.wrongEmail) {
            if (item == data) {
                find = true;
                break;
            }
            index++;
        }
        if (find) {
            this.wrongEmail.splice(index, 1);
        }
    }
}
