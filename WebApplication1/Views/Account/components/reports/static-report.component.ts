import { Component, OnInit, OnDestroy } from "@angular/core";

import { ReportService } from '../../services/report.service';
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/utilities";
import { Constants } from "../../services/Constants";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
var $: any = require("jquery");
@Component({
    selector: "static-report",
    templateUrl: './static-report.component.html',
    styleUrls: ['./static-report.component.css']
})

export class StaticReportComponent implements OnInit {
    todayDate: Date = new Date();
    toDate: Date = new Date();
    fromDate: Date = new Date();
    Report1: any[] = [];
    Report2: any[] = [];
    Report3: any[] = [];
    constructor(private reportService: ReportService, private errorLog: ErrorLogService, private loadingService: LoadingService) {
        //this.fromDate.setDate(this.toDate.getDate() - 30);
    }

    ngOnInit() {
        setTimeout(() => {
            this.GetStaticCorporateReport();
        }, 10);
    }

    GetStaticCorporateReport() {
        if (this.toDate == null || this.fromDate == null) {
            var msg = this.fromDate == null ? "From Date is Required." : "To Date is Required.";
            this.loadingService.showMessage("Required", msg, MessageSeverity.warn);
            return;
        }
        this.Report1 = [];
        this.Report2 = [];
        this.Report3 = [];
        this.loadingService.showLoader(true);
        this.reportService.GetStaticCorporateReport(this.fromDate, this.toDate).subscribe(
            res => {
                if (res.status == 1) {
                    this.Report1 = res.data.Report1;
                    this.Report2 = res.data.Report2;
                    this.Report3 = res.data.Report3;
                }
                else
                {
                    this.loadingService.showMessage("Error", res.msg, MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetStaticCorporateReport").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetStaticCorporateReport").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    Toggletable(ev) {
        var $ele = $(ev.target).parents('.panel-heading');
        $ele.next('.panel-body').slideToggle();
        $ele.find('i').toggleClass('fa-minus fa-plus');
    }
}