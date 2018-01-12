import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from './constants';
import { AdventureChallenge, AdventureCorporateModel } from '../models/challenge.model';

@Injectable()
export class AdventureService {
    private _adventure: any;
    private _step = new Subject<string>();
    constructor(protected http: Http) {

    }
    getCorporatesList(userCorporateID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "EngagementReport/GetCorporateName", { UserCorporateID: userCorporateID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    AssignAdventureToCorporate(adventureCorporateModel: AdventureCorporateModel): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/SaveAssignCorporate", adventureCorporateModel)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    getAllTeamsList(adventureChallenge: AdventureChallenge, challengeTeamType: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/GetAllTeamsList", { ID: adventureChallenge.Id, UserCorporateID: adventureChallenge.UserCorporateID, challengeTeamType: challengeTeamType })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    getUserCorporateId(adventureChallenge: AdventureChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/GetUserCorporateId", adventureChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    EnrollTeamWithAdventure(challangeID: number, selectedTeamIds: string, challengeTeamType: string, action:string): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/EnrollTeamWithAdventure", { StepchallangeID: challangeID, selectedTeamIds: selectedTeamIds, challengeTeamType: challengeTeamType, action: action })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    RemoveTemaFromChallenge(ACorporateID: number, teamId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/RemoveTeamFromList", { ATeam_ACorporateID: ACorporateID, ATeam_TeamID: teamId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SearchMemberByEmail(challengeId: number, corporateId: number, Email: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/SearchMemberByEmail", { StepchallangeID: challengeId, corporateId: corporateId, memberEmail: Email })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SaveTeamAndEnrollMembers(challengeId: number, teamName: string, teamDescription: string, teamImage: string, teamImageName: string, teamInvitedMembersIDs: string, teamAdmin: number, challengeTeamType: string, created_byId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/SaveChallengeTeamAndEnrollMembers", { StepchallangeID: challengeId, teamName: teamName, teamDescription: teamDescription, teamImage: teamImage, teamImageName: teamImageName, teamInvitedMembersIDs: teamInvitedMembersIDs, teamAdmin: teamAdmin, challengeTeamType: challengeTeamType, created_byId: created_byId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SearchMemberByExcel(challengeId: number, corporateId: number, ExcelFileName: string, ExcelFile: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/GetTeamMembersFromExcel", { TeamchallangeID: challengeId, corporateId: corporateId, excelFile: ExcelFile, excelFileName: ExcelFileName })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    GetTeamEmailTemplate(challengeId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/GetEmailTemplate", {})
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    SendEmailToEnrolledTeamMember(challengeId: number, MemberId: number, emailSubject: string, emailDisplayName: string, emailTemplate: string): Observable<any> {
        return this.http.post(Constants.API_URL + "Adventure/SendEmailToEnrolledMembers", { StepchallangeID: challengeId, created_byId: MemberId, emailSubject: emailSubject, emailDisplayName: emailDisplayName, emailTemplate: emailTemplate })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }
    setAdventureData(val: any):void {
        this._adventure = val;
    }
    getAdventureData():any {
        return this._adventure;
    }
    getStep(val: string): void {
        this._step.next(val);
    }
    notify(): Observable<string> {
        return this._step.asObservable();
    }
}