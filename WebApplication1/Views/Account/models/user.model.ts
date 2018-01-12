export class User {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor(ApplicationID: string, CorpoarteImage: string, CorporateName: string, CorporateinfoID: string, MemberID: string, RoleID: string, UserID: string, corpoarteimage: string, Name: string) {

        this.ApplicationID = ApplicationID;
        this.CorpoarteImage = CorpoarteImage;
        this.CorporateName = CorporateName;
        this.CorporateinfoID = CorporateinfoID;
        this.MemberID = MemberID;
        this.RoleID = RoleID;
        this.UserID = UserID;
        this.corpoarteimage = corpoarteimage;
        this.Name = Name;
    }


    //get friendlyName(): string {
    //    let name = this.fullName || this.userName;

    //    if (this.jobTitle)
    //        name = this.jobTitle + " " + name;

    //    return name;
    //}

    public ApplicationID: string;
    public CorpoarteImage: string;
    public CorporateName: string;
    public CorporateinfoID: string;
    public MemberID: string;
    public RoleID: string;
    public UserID: string;
    public corpoarteimage: string;
    public Name: string;
}