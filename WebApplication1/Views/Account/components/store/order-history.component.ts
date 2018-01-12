import { Component, OnInit, ViewEncapsulation, Input, NgModule, TemplateRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { StoreService } from '../../services/store.service';
import { AuthService } from "../../services/auth.service";
import { ErrorLogService } from "../../services/error.log.service";
import { Utilities } from "../../services/Utilities";
import { Constants } from "../../services/constants";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
import { OrderList } from "../../models/store.model";

@Component({
    selector: 'order-history',
    templateUrl: './order-history.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})

export class OrderHistoryComponent implements OnInit {

    userID: number = 0;
    corporatesList: any[] = [];

    ordersSuccessList: any[] = [];
    ordersFailureList: any[] = [];
    cartItemList: any[] = [];

    recoredPerPage: number = 20;
    currentPage: number = 1;
    totalRecored: number = 0;
    totalSuccess: number = 0;
    totalFailure: number = 0;
    totalCartItems: number = 0;
    endDate: any;
    startDate: any;

    modalRef: BsModalRef;
    invoiceSummayData: any[] = [];
    invoiceDetailData: any[] = [];

    totalQuantity: number = 0;
    totalBasicAmt: number = 0.00;
    totalDiscount: number = 0.00;
    totalTaxAmt: number = 0.00;
    totalNetAmt: number = 0.00;
    totalGrossAmt: number = 0.00;


    public orderlist = new OrderList(0, 0, null, null, '', '', 'SUCCESS', 'ORDER', 1, 20);
    public datePipe = new DatePipe("en-US");
    constructor(private storeService: StoreService, private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService, private modalService: BsModalService) {
        this.userID = parseInt(authService.currentUser.UserID);

        this.startDate = null;
        this.endDate = null;
    }

    ngOnInit() {
        setTimeout(() => {
            this.getCorporatesList();
            this.getOrdersList();
        }, 1)
    }

    getCorporatesList() {
        this.storeService.getCorporatesList(this.userID).subscribe(
            res => {
                this.corporatesList = res;
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "Store-getCorporatesList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "Store-getCorporatesList").subscribe(res => { }, error => { });
                }
            });
    }

    getOrdersList() {
        this.loadingService.showLoader(true);

        this.orderlist.PageIndex = this.currentPage;
        this.orderlist.PageSize = this.recoredPerPage;

        this.orderlist.StartDate = this.datePipe.transform(this.startDate, 'yyyy-MM-dd');
        this.orderlist.EndDate = this.datePipe.transform(this.endDate, 'yyyy-MM-dd');

        this.storeService.getOrderList(this.orderlist).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {

                    this.ordersSuccessList = [];
                    this.ordersFailureList = [];
                    this.cartItemList = [];

                    if (this.orderlist.Type === "ORDER") {
                        if (this.orderlist.Status === "SUCCESS")
                            this.ordersSuccessList = res.orderlist;

                        else if (this.orderlist.Status === "FAILURE")
                            this.ordersFailureList = res.orderlist;
                    }
                    else {
                        this.cartItemList = res.cartList;
                    }

                    this.totalSuccess = res.totalSuccess;
                    this.totalFailure = res.totalFailure;
                    this.totalCartItems = res.totalCartItems;
                }
                else if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("error", "Something wrong with showing data.", MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "Store-getOrderList").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "Store-getOrderList").subscribe(res => { }, error => { });
                }
            });
    }

    chagneCorporate(ev) {
        this.orderlist.CorporateId = ev.target.value;
        this.getOrdersList();
    }

    GetType(type: string, status: string): void {
        this.orderlist.Type = type;
        this.orderlist.Status = status;
        this.getOrdersList();
    }

    FilterResult() {
        this.getOrdersList();
    }

    GetCurrentPageRecored(event: any): void {
        this.currentPage = event.page;
        this.getOrdersList();
    }

    ShowPopup(template: TemplateRef<any>, type: string, Id: number) {
        switch (type) {
            case 'invoice':
                this.orderlist.OrderId = Id;
                this.getOrderInvoice(template);
                break;
            case 'track':
                break;
            case 'cartdetail':
                break;
        }
    }

    getOrderInvoice(template: TemplateRef<any>) {
        this.loadingService.showLoader(true);

        this.storeService.getOrderInvoiceDetail(this.orderlist).subscribe(
            res => {
                if (res.status == 1 || res.status == "1") {
                    this.invoiceSummayData = [];
                    this.invoiceDetailData = [];

                    this.invoiceSummayData = res.orderSummary;
                    this.invoiceDetailData = res.orderDetail;

                    this.CalculateSumForInvoice();

                    this.modalRef = this.modalService.show(template, { class: 'modal-lg' });
                }

                else if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showMessage("error", "Something wrong with showing data.", MessageSeverity.error);
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "Store-getOrderInvoiceDetail").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "Store-getOrderInvoiceDetail").subscribe(res => { }, error => { });
                }
            });
    }

    CalculateSumForInvoice() {
        this.totalQuantity= 0;
        this.totalBasicAmt= 0.00;
        this.totalDiscount= 0.00;
        this.totalTaxAmt = 0.00;
        this.totalNetAmt = 0.00;
        this.totalGrossAmt = 0.00;

        this.invoiceDetailData.forEach((e: any) => {
            this.totalQuantity += Number(e.OD_Quantity);
            this.totalBasicAmt += Number(e.OD_SellingAmount);
            this.totalGrossAmt += Number(e.OD_Quantity)* Number(e.OD_SellingAmount);
            this.totalDiscount += Number(e.OD_CouponDiscount);
            this.totalTaxAmt += Number(e.OD_TaxAmount);
        });

        this.totalNetAmt += (this.totalGrossAmt) - this.totalDiscount;
    }


}