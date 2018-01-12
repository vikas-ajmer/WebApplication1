export class CorporateInfo {
    constructor(CorporateInfoID: number, CorporateInfo_Name: string) {
        this.CorporateInfoID = CorporateInfoID;
        this.CorporateInfo_Name = CorporateInfo_Name;
    }

    CorporateInfoID: number;
    CorporateInfo_Name: string;
}

export class CorporateBasicDetails {
    constructor(corporateName: string, corporateLocation: string, corporateAddress: string, corporateLogo: string, UserID: number,
        CorporateInfo_RegLimit: number, subdomain: string, filetype: string, ImageName: string, CorporateInfoID: number, CorporateInfo_IsDump: boolean, isUpdate: boolean, corporate_PackageId: number) {
        this.corporateName = corporateName;
        this.corporateLocation = corporateLocation;
        this.corporateAddress = corporateAddress;
        this.corporateLogo = corporateLogo;
        this.corporateUserID = UserID;
        this.corporateInfo_RegLimit = CorporateInfo_RegLimit;
        this.corporateSubdomain = subdomain;
        this.corporateLogofiletype = filetype;
        this.corporateImageName = ImageName;
        this.corporateInfoID = CorporateInfoID;
        this.corporateInfo_IsDump=CorporateInfo_IsDump;
        this.corporateIsUpdate = isUpdate;
        this.corporate_PackageId = corporate_PackageId;
    }
    corporateName: string;
    corporateLocation: string;
    corporateAddress: string;
    corporateLogo: string;
    corporateUserID: number;
    corporateInfo_RegLimit: number;
    corporateSubdomain: string;
    corporateLogofiletype: string;
    corporateImageName: string;
    corporateInfoID: number;
    corporateInfo_IsDump: boolean;
    corporateIsUpdate: boolean;
    corporate_PackageId: number;
}

export class CorporateFeaturs {
    constructor(CorporateinfoID: number, PremiumDashboard: boolean, GuidedPrograms: boolean, DietPlanBasic: boolean, NutritionistApp: boolean, NutritionistChat: boolean,
        CounsellorApp: boolean, CounsellorChat: boolean, DoctorApp: boolean, DoctorChat: boolean, Teams: boolean, Community: boolean,
        HealthyBenefits: boolean, ProgrameAutoJoin: boolean, Challenges: boolean, HealthOpinion: boolean, InterestGroups: boolean, HealthCheckup: boolean,
        HRAStepSkip: boolean, GuidedProgramme: number[], AutoJoinProgramme: number[], dietitian: number, counsellor: number, doctor: number) {
        this.CorporateinfoID = CorporateinfoID;
        this.PremiumDashboard = PremiumDashboard;
        this.GuidedPrograms = GuidedPrograms;
        this.DietPlanBasic = DietPlanBasic;
        this.NutritionistApp = NutritionistApp;
        this.NutritionistChat = NutritionistChat;
        this.CounsellorApp = CounsellorApp;
        this.CounsellorChat = CounsellorChat;
        this.DoctorApp = DoctorApp;
        this.DoctorChat = DoctorChat;
        this.Teams = Teams;
        this.Community = Community;
        this.HealthyBenefits = HealthyBenefits;
        this.ProgrameAutoJoin = ProgrameAutoJoin;
        this.Challenges = Challenges;
        this.HealthOpinion = HealthOpinion;
        this.InterestGroups = InterestGroups;
        this.HealthCheckup = HealthCheckup;
        this.HRAStepSkip = HRAStepSkip;
        this.GuidedProgramme = GuidedProgramme;
        this.AutoJoinProgramme = AutoJoinProgramme;
        this.dietitian = dietitian;
        this.counsellor = counsellor;
        this.doctor = doctor;
    }
    CorporateinfoID: number;
    PremiumDashboard: boolean;
    GuidedPrograms: boolean;
    DietPlanBasic: boolean;
    NutritionistApp: boolean;
    NutritionistChat: boolean;
    CounsellorApp: boolean;
    CounsellorChat: boolean;
    DoctorApp: boolean;
    DoctorChat: boolean;
    Teams: boolean;
    Community: boolean;
    HealthyBenefits: boolean;
    ProgrameAutoJoin: boolean;
    Challenges: boolean;
    HealthOpinion: boolean;
    InterestGroups: boolean;
    HealthCheckup: boolean;
    HRAStepSkip: boolean;
    GuidedProgramme: number[];
    AutoJoinProgramme: number[];
    dietitian: number;
    counsellor: number;
    doctor: number;
}