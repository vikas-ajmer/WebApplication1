import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CorporateService } from '../../../services/corporate.service';
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
@Component({
    selector: 'corporate-add-emp',
    templateUrl: './corporate-delete-emp.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class DeleteCorporateEmpComponent implements OnInit {
    corporateInfoId: any;
    corporateBasicDetails: any = {};
    IsShowComponent: boolean = false;
    constructor(private route: ActivatedRoute, private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService) {
        this.corporateInfoId = this.route.snapshot.paramMap.get('id');
        corporateService.setCorporateIsEmpDel(true);
    }

    ngOnInit() {
        setTimeout(() => {
            this.GetCorporateBasicDetails();
        }, 10);
    }
    GetCorporateBasicDetails(): void {
        this.loadingService.showLoader(true);
        this.corporateService.getCorporateBasicDetails(this.corporateInfoId | 0).subscribe((res: any) => {
            this.corporateBasicDetails = { CorporateInfo_Name: res.result.corporateName, CorporateInfoID: res.result.corporateInfoID };
            this.corporateService.setNewCorporate(this.corporateBasicDetails);
            this.IsShowComponent = true;
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
}
