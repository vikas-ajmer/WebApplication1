import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../../directives/file-upload/index';
import { CorporateService } from '../../../../services/corporate.service';
import { ErrorLogService } from "../../../../services/error.log.service";
import { Utilities } from "../../../../services/Utilities";
import { LoadingService, MessageSeverity } from "../../../../services/loader.service";
import { AuthService } from "../../../../services/auth.service";
import { Constants } from "../../../../services/constants";
import { CorporateBasicDetails } from "../../../../models/corporate.model";
@Component({
    selector: 'basic-detail',
    templateUrl: './basic-detail.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class BasicDetailComponent implements OnInit {
    corporateInfoId: any;
    ImgUrl: any="";
    isLogoUpdate: boolean = false;
    selectedFiles: any;
    selectedFileName: any = " ";
    packageList: any[] = [];
    upfile: string[] = [];
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 50000,
        totalFilesSize: 50000
    };
    corporateBasicDetails = new CorporateBasicDetails("", "", "", "", 0, 0, "", "", "", 0, false, false,0);

    constructor(private route: ActivatedRoute, private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService, private ng4FilesService: Ng4FilesService, private authService: AuthService) {
        this.corporateInfoId=this.route.snapshot.paramMap.get('id');
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        this.GetCorporatePackageList();
        setTimeout(() => {
            this.GetCorporateBasicDetails();
        }, 100);
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
        this.corporateBasicDetails.corporateLogofiletype = selectedFiles.files[0].type;
        let reader = new FileReader();
        let file = selectedFiles.files[0];
        this.selectedFileName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
            this.upfile.push(this.selectedFiles);
            this.corporateBasicDetails.corporateLogo = this.selectedFiles;
        };
    }
    SaveBasicDatails(): void {
        this.loadingService.showLoader(true);
        this.corporateService.addCorporateBasicDetails(this.corporateBasicDetails).subscribe((res: any) => {
            if (res.status.CorporateInfoID === 0 || res.status.CorporateInfoID === -1 || res.status.CorporateInfoID === -2) {
                this.loadingService.showMessage("", res.status.CorporateInfo_Name, MessageSeverity.error);
                this.loadingService.showLoader(false);
                return false;
            }
            else
            {
                console.log(res.isCreateLandingPage);
                var msg = this.corporateBasicDetails.corporateIsUpdate ? "corporate details updated." : "corporate details added.";
                this.loadingService.showMessage("success", msg, MessageSeverity.success);
                this.corporateService.setNewCorporate(res.status);
                this.GoToStep("feature");
            }
            this.loadingService.showLoader(false);
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveBasicDatails").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveBasicDatails").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }

    GetCorporateBasicDetails(): void {
        this.loadingService.showLoader(true);
        this.corporateService.getCorporateBasicDetails(this.corporateInfoId|0).subscribe((res: any) => {
            this.corporateBasicDetails = res.result;
            this.ImgUrl = res.ImgUrl;
            this.corporateBasicDetails.corporateUserID = this.authService.currentUserId;
            this.loadingService.showLoader(false);
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetCorporateBasicDetails").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetCorporateBasicDetails").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    GetCorporatePackageList(): void {
        this.corporateService.getCorporatePackageList().subscribe((res: any) => {
            this.packageList.push({ Id: 0, Name: "Select Package" });
            this.packageList = this.packageList.concat(res.Data);
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetCorporatePackageList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetCorporatePackageList").subscribe(res => { }, error => { });
                }
            });
    }
    GoToStep(step: string): void {
        this.corporateService.getStep(step);
    }
}
