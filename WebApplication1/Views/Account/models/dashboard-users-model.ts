export class DashboardUser {
    constructor() {
        this.CorporateUsers = new Array<Dashboard_CorporateUser>();
        this.onlineUsers = new Dashboard_OnlineUser();
        this.dietitianChat = new Array<Dashboard_DietitianChat>();
        this.statistics = new Dashboard_Statistics();
    }

    public CorporateUsers: Array<Dashboard_CorporateUser>;
    public onlineUsers: Dashboard_OnlineUser;
    public dietitianChat: Array<Dashboard_DietitianChat>;
    public statistics: Dashboard_Statistics;

}

export class Dashboard_CorporateUser {
    constructor() {
        this.CorporateInfoId = 0;
        this.CorporateInfo_Name = "";
        this.OnlineUserAnd = 0;
        this.OnlineUserIOS = 0;
        this.OnlineUserTotal = 0;
        this.OnlineUserWeb = 0;
    }

    public CorporateInfoId: number;
    public CorporateInfo_Name: string;
    public OnlineUserAnd: number;
    public OnlineUserIOS: number;
    public OnlineUserTotal: number;
    public OnlineUserWeb: number;
}

export class Dashboard_OnlineUser {
    constructor() {
        this.OnlineUser_And = 0;
        this.OnlineUser_IOS = 0;
        this.OnlineUser_Total = 0;
        this.OnlineUser_Web = 0;
    }

    public OnlineUser_And: number;
    public OnlineUser_IOS: number;
    public OnlineUser_Total: number;
    public OnlineUser_Web: number;
}

export class Dashboard_DietitianChat {
    constructor() {
        this.HealthExpertID = 0;
        this.OnlineStatus = "";
        this.ClosedChat = 0;
        this.OngoingChat = 0;
        this.TotalChat = 0;
    }
    public HealthExpertID: number;
    public OnlineStatus: string;
    public ClosedChat: number;
    public OngoingChat: number;
    public TotalChat: number;
}

export class Dashboard_Statistics {
    constructor() {
        this.UserRegistered = 0;
        this.UniqueLogins = 0;
        this.ProfileCompleted = 0;
        this.HRACompleted = 0;
    }
    public UserRegistered: number;
    public UniqueLogins: number;
    public ProfileCompleted: number;
    public HRACompleted: number;
}
