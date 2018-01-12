import { Component, OnInit, ViewEncapsulation, TemplateRef } from '@angular/core';

import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../directives/file-upload/index';
import { CorporateService } from '../../services/corporate.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/Utilities";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { AuthService } from "../../services/auth.service";
import { Constants } from "../../services/constants";
import { CorporateBasicDetails } from "../../models/corporate.model";
@Component({
    selector: 'delete-import-user',
    templateUrl: './delete-user-import.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class DeleteImportUserComponent implements OnInit {
    corporate: any;
    IsCorporateEmpDel: boolean = false;
    isUserImported: boolean = false;
    totalEmployeeRegistered: number = 0;
    registrationLimit: number = 0;
    selectedFiles: any;
    selectedFileName: any = " ";
    wrongEmail: any;
    duplicateEmail: any;
    removedMember: any;
    notRegistered: any;
    upfile: string[] = [];
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['xls', 'csv', 'xlsx'],
        maxFilesCount: 1,
        maxFileSize: 50000,
        totalFilesSize: 50000
    };
    constructor(private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.corporate = this.corporateService.getNewCorporate();
        this.IsCorporateEmpDel = this.corporateService.getCorporateIsEmpDel();
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
    DeleteImportUser(): void {
        if (this.selectedFiles != null && this.selectedFiles != undefined && this.selectedFiles != 'undefined') {
            this.loadingService.showLoader(true);
            this.corporateService.RemoveImportUser(this.selectedFiles, this.corporate.CorporateInfoID).subscribe((res: any) => {
                if (res.status == -1) {
                    this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                    this.loadingService.showLoader(false);
                    return false;
                }
                else if (res.status == 0) {
                    this.getTotalAndLimitByCorporateInfoId();
                    this.selectedFiles = null;
                    this.wrongEmail = res.wrongemail;
                    this.duplicateEmail = res.doubleobject;
                    this.removedMember = res.removedMembers;
                    this.notRegistered = res.notindatabase;
                    this.isUserImported = true;
                    this.loadingService.showLoader(false);
                }
                this.loadingService.showLoader(false);
            }, error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "DeleteImportUser").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "DeleteImportUser").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
        }
        else {
            this.loadingService.showMessage("required", "Excel file is required", MessageSeverity.error);
        }
    }

    DeleteWrongEmailUserAgain(): void {
        this.loadingService.showLoader(true);
        this.corporateService.RemoveImportUser(this.selectedFiles, this.corporate.CorporateInfoID, this.wrongEmail).subscribe((res: any) => {
            if (res.status == -1) {
                this.loadingService.showMessage("Error", res.error, MessageSeverity.error);
                this.loadingService.showLoader(false);
                return false;
            }
            else if (res.status == 0) {
                this.getTotalAndLimitByCorporateInfoId();
                this.wrongEmail = res.wrongemail;
                this.removedMember = this.removedMember + res.removedMembers;
                this.notRegistered = this.notRegistered.concat(res.notindatabase);
                this.isUserImported = true;
                this.loadingService.showLoader(false);
            }
            this.loadingService.showLoader(false);
        }, error => {
            if (Utilities.checkNoNetwork(error)) {
                this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "DeleteWrongEmailUserAgain").subscribe(res => { }, error => { });
            }
            else {
                let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "DeleteWrongEmailUserAgain").subscribe(res => { }, error => { });
            }
            this.loadingService.showLoader(false);
        });
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
