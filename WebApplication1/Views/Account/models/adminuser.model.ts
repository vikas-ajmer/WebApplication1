export class UsersList {
    UserCorporateID: number;
    MemberID: number;
    MemberName: string;
    Email: string;
    Corporate: any;
    Role: string;
    RoleID: number;
    UserId: string;
    constructor(UserCorporateID: number, MemberID: number, MemberName: string, Email: string, Corporate: any, Role: string
        ,RoleID: number, UserId: string) {
        this.UserCorporateID = UserCorporateID;
        this.MemberID = MemberID;
        this.MemberName = MemberName;
        this.Email = Email;
        this.Corporate = Corporate;
        this.RoleID = RoleID;
        this.MemberName = MemberName;
        this.UserId = UserId;
    }
}