export class UserProfileModel {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public Age: number;
    public DeviceType: string;
    public HRACompletedOn: string;
    public HealthProfileCompleted: string;
    public LastDeviceConnectOn: string;
    public LastLoggedInOn: string;
    public LastStepsSyncOn: string;
    public MemberHRAID: number;
    public MemberID: number;
    public MemberImage: string;
    public MemberName: string;
    public MemberScreenName: string;
    public MemeberGender: string;
    public Peps: number;
    public TeamJoinOn: string;
    public TeamName: string;
    public TotalSteps: number;
    public isHRACompletedOn: boolean;
    public RegistrationCompleted: number;
}

export class MemberPrograms {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public ProgramID: number;
    public ProgramName: string;
    public StartDate: string;
    public IsCompleted: number;
    public IsOngoing: number;
    public IsIncomplete: number;
    public TotalCount: number;
}


export class MemberChallenges {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public ChallengeID: number = 0;
    public ChallengeName: string;
    public ChallengeCategory: string;
    public JoinDate: string = "";
    public ChallengePositiveResponses: boolean | null;
    public Image: string;
    public ChallengeType: string;
    public StartDate: string;
    public IsCompleted: number;
    public IsOngoing: number;
    public IsIncomplete: number;
    public TotalCount: number;
}

export class MemberPointsStatement {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public StatementDate: string;
    public Points: number;
    public RedeemPoints: number;
}

export class MemberPointsStatement_Monthly {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public Activity: string;
    public Points: number | null;
    public ActivityDate: any;
}

export class MemberSteps {
    // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
    constructor() {
    }

    public TrackerID: number = 0;
    public MemberID: number = 0;
    public Steps: number;
    public TrackerDate: string;
    public DeviceType: string;
    public TotalCount: number;

}

export class WrapperModel<T>{
    constructor(private testType: new () => T) {
        this.Entity = new testType();
        this.ShowLoading = false;
    }

    public Entity: T;
    public ShowLoading: boolean;
}


