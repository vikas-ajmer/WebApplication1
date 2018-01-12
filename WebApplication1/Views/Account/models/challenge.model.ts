export class ChallengeList {
    ID: number;
    ChallengeName: string;
    ChallengeTypeName: string;
    CorporateName: string;
    constructor(ID: number, ChallengeName: string, ChallengeTypeName: string, CorporateName: string) {
        this.ID = ID;
        this.ChallengeName = ChallengeName;
        this.ChallengeTypeName = ChallengeTypeName;
        this.CorporateName = CorporateName;
    }
}
export class CorporateChallenge {
    constructor(Id: number, MemberId: number, ChallengeName: string, ChallengeCategory: string, ChallengeType: number, ChallengeLevel: number,
        ChallengeDescription: string, ChallengeTags: string, ChallengeQuestion: string, ChallengeDuration: number, ChallengeImage: string,
        rdblstChallengeCategory: string, Desiredanswer: string, AlternateAnswer: string, Completions: number, Selectfrequency: number,
        CheckinBox: string, Image: string, ImageName: string, CountingCategory: string, Challenge_IsPrivateAudience: boolean,
        IsAllCorporate: boolean, CorporateList: string) {
        this.Id = Id;
        this.MemberId = MemberId;
        this.ChallengeName = ChallengeName;
        this.ChallengeCategory = ChallengeCategory;
        this.ChallengeType = ChallengeType;
        this.ChallengeLevel = ChallengeLevel;
        this.ChallengeDescription = ChallengeDescription;
        this.ChallengeTags = ChallengeTags;
        this.ChallengeQuestion = ChallengeQuestion;
        this.ChallengeDuration = ChallengeDuration;
        this.ChallengeImage = ChallengeImage;
        this.rdblstChallengeCategory = rdblstChallengeCategory;
        this.Desiredanswer = Desiredanswer;
        this.AlternateAnswer = AlternateAnswer;
        this.Completions = Completions;
        this.Selectfrequency = Selectfrequency;
        this.CheckinBox = CheckinBox;
        this.Image = Image;
        this.ImageName = ImageName;
        this.CountingCategory = CountingCategory;
        this.Challenge_IsPrivateAudience = Challenge_IsPrivateAudience;
        this.IsAllCorporate = IsAllCorporate;
        this.CorporateList = CorporateList;
    }
    Id: number;
    MemberId: number;
    ChallengeName: string;
    ChallengeCategory: string;
    ChallengeType: number;
    ChallengeLevel: number;
    ChallengeDescription: string;
    ChallengeTags: string;
    ChallengeQuestion: string;
    ChallengeDuration: number;
    ChallengeImage: string;
    rdblstChallengeCategory: string;
    Desiredanswer: string;
    AlternateAnswer: string;
    Completions: number;
    Selectfrequency: number;
    CheckinBox: string;
    Image: string;
    ImageName: string;
    CountingCategory: string;
    Challenge_IsPrivateAudience: boolean;
    IsAllCorporate: boolean;
    CorporateList: string;
}
export class AdventureChallenge {
    constructor(Id: number, AdventureName: string, AdventureDescription: string, StartLatitude: number, StartLongtitude: number, EndLatitude: number, EndLongtitude: number,
        AdventureStartLocation: string, AdventureEndLocation: string, AdventureReturnWay: boolean, AdventureDistance: number, Image: string, ImageName: string, SavedImage: string, UserCorporateID: number) {
        this.Id = Id;
        this.AdventureName = AdventureName;
        this.AdventureDescription = AdventureDescription;
        this.StartLatitude = StartLatitude;
        this.StartLongtitude = StartLongtitude;
        this.EndLatitude = EndLatitude;
        this.EndLongtitude = EndLongtitude;
        this.AdventureStartLocation = AdventureStartLocation;
        this.AdventureEndLocation = AdventureEndLocation;
        this.AdventureReturnWay = AdventureReturnWay;
        this.AdventureDistance = AdventureDistance;
        this.Image = Image;
        this.ImageName = ImageName;
        this.SavedImage = SavedImage;
        this.UserCorporateID = UserCorporateID;

    }
    Id: number;
    AdventureName: string;
    AdventureDescription: string;
    StartLatitude: number;
    StartLongtitude: number;
    EndLatitude: number;
    EndLongtitude: number;
    AdventureStartLocation: string;
    AdventureEndLocation: string;
    AdventureReturnWay: boolean;
    AdventureDistance: number;
    Image: string;
    ImageName: string;
    SavedImage: string;
    UserCorporateID: number;
    AdventureCreateOn: Date;
    AdventureCreateBy: number;
    AdventureIsActive: boolean;
}

export class Question {
    constructor(title: string, desired: string, alternate: string, start: number, end: number) {
        this.title = title;
        this.desired = desired;
        this.alternate = alternate;
        this.start = start;
        this.end = end;
    }
    title: string;
    desired: string;
    alternate: string;
    start: number;
    end: number;
}

export class TeamChallenge {
    constructor(teamchallengeid: number, chellangeCategory: number, chellangeName: string, chellangeDuration: number,
        chellangeDescription: string, chellangeRules: string, chellangeThreshold: number, Image: string, ImageName: string,
        challengeImage: string, corporateinfoid: number, userid: number, UserCorporateID: number, questions: Question[]) {
        this.teamchallengeid = teamchallengeid;
        this.chellangeCategory = chellangeCategory;
        this.chellangeName = chellangeName;
        this.chellangeDuration = chellangeDuration;
        this.chellangeDescription = chellangeDescription;
        this.chellangeRules = chellangeRules;
        this.chellangeThreshold = chellangeThreshold;
        this.Image = Image;
        this.ImageName = ImageName;
        this.challengeImage = challengeImage;
        this.corporateinfoid = corporateinfoid;
        this.userid = userid;
        this.UserCorporateID = UserCorporateID;
        this.questions = questions;
    }
    teamchallengeid: number;
    chellangeCategory: number;
    chellangeName: string;
    chellangeDuration: number;
    chellangeDescription: string;
    chellangeRules: string;
    chellangeThreshold: number;
    Image: string;
    ImageName: string;
    challengeImage: string;
    corporateinfoid: number;
    userid: number;
    UserCorporateID: number;
    questions: Question[];
}


export class StepChallenge {
    constructor(stepChallengeId: number, challengeName: string, corporateId: number, type: number, description: string, corporateName: string, leaderBoardDirectory: string,
        leaderBoardurl: string, pepsOnCompletion: number, startDate: string, endDate: string, createdDate: string, duration: number, period: number, 
        targetSteps: number, maxStepsPerDay: number, image: string, imageName: string, leaderBoardTemplate: string, userCorporateID: number,
        PageIndex: number, PageSize: number)
    {
        this.stepChallengeId = stepChallengeId;
        this.challengeName = challengeName;
        this.corporateId = corporateId;
        this.type = type;
        this.description = description;
        this.corporateName = corporateName;
        this.leaderBoardDirectory = leaderBoardDirectory;
        this.leaderBoardurl = leaderBoardurl;
        this.pepsOnCompletion = pepsOnCompletion;
        this.startDate = startDate;
        this.endDate = endDate;
        this.createdDate = createdDate;
        this.duration = duration;
        this.period = period;
        this.targetSteps = targetSteps;
        this.maxStepsPerDay = maxStepsPerDay;
        this.image = image;
        this.imageName = imageName;
        this.leaderBoardTemplate = leaderBoardTemplate;
        this.userCorporateID = userCorporateID;
        this.PageIndex = PageIndex;
        this.PageSize = PageSize
    }

    stepChallengeId: number;
    challengeName: string;
    corporateId: number;
    type: number;
    description: string;
    corporateName: string;
    leaderBoardDirectory: string;
    leaderBoardurl: string;
    pepsOnCompletion: number;
    startDate: string;
    endDate: string;
    createdDate: string;
    duration: number;
    period: number;
    targetSteps: number;
    maxStepsPerDay: number;
    image: string;
    imageName: string;
    leaderBoardTemplate: string;
    userCorporateID: number;
    PageIndex: number;
    PageSize: number;
}


export class AdventureCorporateModel {
    constructor(ACorporate_ID: number, ACorporate_AdventureID: number, ACorporate_CorporateInfoID: number, ACorporate_StartDate: Date,
        ACorporate_EndDate: Date, ACorporate_MinimumMember: number, ACorporate_CreateOn: Date, ACorporate_CreateBy: number,
        ACorporate_IsActive: boolean, ACorporate_StartDate_String: string, ACorporate_EndDate_String: string) {
        this.ACorporate_ID = ACorporate_ID;
        this.ACorporate_AdventureID = ACorporate_AdventureID;
        this.ACorporate_CorporateInfoID = ACorporate_CorporateInfoID;
        this.ACorporate_StartDate = ACorporate_StartDate;
        this.ACorporate_EndDate = ACorporate_EndDate;
        this.ACorporate_MinimumMember = ACorporate_MinimumMember;
        this.ACorporate_CreateOn = ACorporate_CreateOn;
        this.ACorporate_CreateBy = ACorporate_CreateBy;
        this.ACorporate_IsActive = ACorporate_IsActive;
        this.ACorporate_StartDate_String = ACorporate_StartDate_String;
        this.ACorporate_EndDate_String = ACorporate_EndDate_String;
    }
    ACorporate_ID: number;
    ACorporate_AdventureID: number;
    ACorporate_CorporateInfoID: number;
    ACorporate_StartDate: Date;
    ACorporate_EndDate: Date;
    ACorporate_MinimumMember: number;
    ACorporate_CreateOn: Date;
    ACorporate_CreateBy: number;
    ACorporate_IsActive: boolean;
    ACorporate_StartDate_String: string;
    ACorporate_EndDate_String: string;
}