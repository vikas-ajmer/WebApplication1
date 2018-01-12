import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from './constants';
import { CorporateChallenge, AdventureChallenge, TeamChallenge } from '../models/challenge.model';

@Injectable()
export class ChallengeService {
    private individualChallenge: any;
    private tamChallenge: any;
    private _step = new Subject<string>();
    constructor(protected http: Http) {

    }

    challengeList(userCorporateID: number, corporateID: number, pageIndex: number, pageSize: number, challengeType: number, searchTerm: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetChallengesList", { UserCorporateID: userCorporateID, CorporateID: corporateID, PageIndex: pageIndex, PageSize: pageSize, ChallengeType: challengeType, SearchTerm: searchTerm })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    individualChallengeList(userCorporateID: number, corporateID: number, pageIndex: number, pageSize: number, searchTerm: string, searchCategory: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetIndividualChallengesList", { UserCorporateID: userCorporateID, CorporateID: corporateID, PageIndex: pageIndex, PageSize: pageSize, SearchTerm: searchTerm, SearchCategory: searchCategory })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    getAdeventurelist(AdventureName: string, CurrentPage: number, RecordPerPage:number): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/Adeventurelist", { AdventureName, CurrentPage, RecordPerPage })
            .map(result => result.json())
            .catch(error => {
                return error;
            });

    }
    getCorporatesList(userCorporateID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "EngagementReport/GetCorporateName", { UserCorporateID: userCorporateID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetCategoryList(): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetCategory", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    getSearchTag(): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/GetSearchTag", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetIndividualChallenge(ChallengeId:any): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/EditCorporateChallenge", { Id: ChallengeId})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetTeamChallenge(ChallengeId: any): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/EditChallenge", { ID: ChallengeId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveIndividualChallenge(corporateChallenge: CorporateChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/SaveChallenges", corporateChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    UpdateAdventureChallenge(adventureChallenge: AdventureChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/UpdateAdventure", adventureChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveAdventureChallenge(adventureChallenge: AdventureChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/CreateAdventure", adventureChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetAdventureChallenge(adventureChallenge: AdventureChallenge): Observable<any> {
        return this.http.get(Constants.API_URL + "Adventure/GetAdventureByID?id="+ adventureChallenge.Id )
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    EnrollMemberToChallenge(Id: number, userid: number, IsPrivateAudience: boolean, IsAllCorporate: boolean, MemberEmail: string, CorporateList: string, ExcelFile: string, ExcelFileName:string): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/EnrollMemberToChallenge", { Id: Id, userid: userid, Challenge_IsPrivateAudience: IsPrivateAudience, IsAllCorporate: IsAllCorporate, MemberEmail: MemberEmail, CorporateList: CorporateList, ExcelFile: ExcelFile, ExcelFileName: ExcelFileName})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetEnrolledMember(Id: number): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/GetEnrolledMemberByChallengeId", { ChallengeId: Id})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    RemoveMemberFromChallenge(challengeId: number, MemberId:number): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/LeaveMemberFromChallenge", { ChallengeId: challengeId, MemberId: MemberId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SendEmailToEnrolledMember(challengeId: number, MemberId: number, senderCorporateId: any, emailSubject: string, emailDisplayName: string, emailTemplate: string, ChallengeName:string): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/SendInvitation", { Id: challengeId, senderId: MemberId, senderCorporateId: senderCorporateId, emailSubject: emailSubject, emailDisplayName: emailDisplayName, emailTemplate: emailTemplate, ChallengeName: ChallengeName })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetEmailTemplate(challengeId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "CorporateChallenge/GetEmailTemplate", { ChallengeId: challengeId})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveTeamChallenge(teamChallenge: TeamChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/SaveChallenge", teamChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveAndEnrollTeam(challangeID: number, selectedTeamIds: string, challengeTeamType: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/SaveEnrolledTeamWithTeamChallange", { TeamchallangeID: challangeID, selectedTeamIds: selectedTeamIds, challengeTeamType: challengeTeamType})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    RemoveTemaFromChallenge(challangeID: number, teamId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/RemoveTeamFromTeamChallenge", { TeamchallangeID: challangeID, teamId: teamId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetTeamList(corporateId: number, challangeID: number, challengeTeamType: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetCorporeteTeamByID", { corporateId: corporateId, TeamchallangeID: challangeID, challengeTeamType: challengeTeamType})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetTeamMemberByTeamId(teamId: number, challangeID: number,challengeTeamType: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetAllTeamMembersByTeamID", { teamId: teamId, TeamchallangeID: challangeID, challengeTeamType: challengeTeamType })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetTeamEmailTemplate(challengeId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetEmailTemplate", { })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SearchMemberByEmail(challengeId: number,corporateId:number,Email:string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/SearchMemberByEmail", { TeamchallangeID: challengeId, corporateId: corporateId, memberEmail: Email})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SearchMemberByExcel(challengeId: number, corporateId: number,ExcelFileName:string, ExcelFile: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/GetTeamMembersFromExcel", { TeamchallangeID: challengeId, corporateId: corporateId, excelFile: ExcelFile, excelFileName: ExcelFileName })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveTeamAndEnrollMembers(challengeId: number, teamName: string, teamDescription: string, teamImage: string, teamImageName: string, teamInvitedMembersIDs: string, teamAdmin: number, challengeTeamType: string, created_byId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/SaveTeamAndMembers", { TeamchallangeID: challengeId, teamName: teamName, teamDescription: teamDescription, teamImage: teamImage, teamImageName: teamImageName, teamInvitedMembersIDs: teamInvitedMembersIDs, teamAdmin: teamAdmin, challengeTeamType: challengeTeamType, created_byId: created_byId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SendEmailToEnrolledTeamMember(challengeId: number, MemberId: number, emailSubject: string, emailDisplayName: string, emailTemplate: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Challenge/SendInvitation", { TeamchallangeID: challengeId, created_byId: MemberId, emailSubject: emailSubject, emailDisplayName: emailDisplayName, emailTemplate: emailTemplate })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    setIndividualChallenge(val: any): void {
        this.individualChallenge = val;
    }
    getIndividualChallenge():any {
        return this.individualChallenge;
    }
    seTeamChallenge(val: any): void {
        this.tamChallenge = val;
    }
    getTeamChallenge(): any {
        return this.tamChallenge;
    }
    getStep(val: string): void {
        this._step.next(val);
    }
    notify(): Observable<string> {
        return this._step.asObservable();
    }
}