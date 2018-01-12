import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ChallengeService } from '../../../services/challenge.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { AuthService } from "../../../services/auth.service";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
import { AdventureChallenge } from '../../../models/challenge.model';

@Component({
    selector: 'adventure-create',
    templateUrl: './adventure-create.component.html',
    styleUrls: ['./adventure-create.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdventureCreateComponent implements OnInit {

    adventureList: any;
    @Input() UserId: number = 0;
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };

    selectedFiles: any;
    selectedFileName: any;
    pageStep: string = "adventure-create";

    public adventureChallenge = new AdventureChallenge(0, "", "", 0, 0, 0, 0, "", "", false, 0, "", "", "", 0);

    constructor(private router: Router, private route: ActivatedRoute, private challengeService: ChallengeService, private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService, private ng4FilesService: Ng4FilesService) {
        
    }
    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
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
        this.adventureChallenge.ImageName = file.name;
        reader.readAsDataURL(file);
        reader.onload = () => {
            this.selectedFiles = reader.result.split(',')[1];
            this.adventureChallenge.Image = this.selectedFiles;
        };
    }
    SaveAdventureChallenge() {
        if (this.selectedFiles == undefined || this.selectedFiles == "undefined" || this.selectedFiles == "") {
            this.loadingService.showMessage("error", "Adventure image is required", MessageSeverity.error);
            return false;
        }
        this.loadingService.showLoader(true);
        this.challengeService.SaveAdventureChallenge(this.adventureChallenge).subscribe(
            res => {
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showStickyMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status > 0) {
                    this.loadingService.showMessage("success", "Adventure created successfully", MessageSeverity.success);
                    //this.challengeService.getStep("adventure-setdetails");
                    this.pageStep = "adventure-setdetails";
                    this.router.navigate(["challenge/adventure-setdetails/" + res.status], { replaceUrl: true });
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveAdventureChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SaveAdventureChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
}