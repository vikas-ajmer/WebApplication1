export class OrderList {

    constructor(OrderId: number, CorporateId: number, StartDate: string, EndDate: string, InvoiceNo: string, MemberEmail: string,
                Status: string, Type: string, PageIndex: number, PageSize: number) {
        this.OrderId = OrderId;
        this.CorporateId = CorporateId;
        this.StartDate = StartDate;
        this.EndDate = EndDate;
        this.InvoiceNo = InvoiceNo;
        this.MemberEmail = MemberEmail;
        this.Status = Status;
        this.Type = Type;
        this.PageIndex = PageIndex;
        this.PageSize = PageSize;
    }

    OrderId: number;
    CorporateId: number;
    StartDate: string;
    EndDate: string;
    InvoiceNo: string;
    MemberEmail: string;
    Status: string;
    Type: string;
    PageIndex: number;
    PageSize: number;
}
