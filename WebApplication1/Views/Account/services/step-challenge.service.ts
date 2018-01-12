import { Injectable, Injector } from '@angular/core';
import { Http, Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Constants } from './constants';
import { StepChallenge } from '../models/challenge.model';



@Injectable()
export class StepChallengeService {
    private stepChallenge: any;
    private _step = new Subject<string>();

    constructor(protected http: Http) {

    }

    getCorporatesList(userCorporateID: number): Observable<any[]> {
        return this.http.post(Constants.API_URL + "EngagementReport/GetCorporateName", { UserCorporateID: userCorporateID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getStepChallengeList(stepChallenge:StepChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/StepChallengeslist", stepChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    getStepChallengeById(challangeID: number): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetStepChallengeByID", { StepchallangeID: challangeID })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    SaveStepChallenge(stepChallenge: StepChallenge): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/SaveStepChallenges", stepChallenge)
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    GetTeamList(corporateId: number, challangeID: number, challengeType: string): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetCorporateTeamByID", { corporateId: corporateId, StepchallangeID: challangeID, challengeTeamType: challengeType })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    GetTeamMemberByTeamId(teamId: number, challangeID: number, challengeType: string): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetAllTeamMembersByTeamID", { teamId: teamId, StepchallangeID: challangeID, challengeTeamType: challengeType })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    SaveTeamAndEnrollMembers(challengeId: number, teamName: string, teamDescription: string, teamImage: string, teamImageName: string, teamInvitedMembersIDs: string, teamAdmin: number, challengeTeamType: string, created_byId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/SaveChallengeTeamAndEnrollMembers", { StepchallangeID: challengeId, teamName: teamName, teamDescription: teamDescription, teamImage: teamImage, teamImageName: teamImageName, teamInvitedMembersIDs: teamInvitedMembersIDs, teamAdmin: teamAdmin, challengeTeamType: challengeTeamType, created_byId: created_byId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    SaveAndEnrollTeam(challangeID: number, selectedTeamIds: string, challengeTeamType: string, EmailSubject: string, EmailDisplayName: string, EmailTemplate: string, IsSendEmail: boolean): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/SaveEnrolledTeamWithStepChallange", { StepchallangeID: challangeID, selectedTeamIds: selectedTeamIds, challengeTeamType: challengeTeamType, emailSubject: EmailSubject, emailDisplayName: EmailDisplayName, emailTemplate: EmailTemplate, isSendEmail: IsSendEmail  })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    RemoveTeamOrMember(challangeID: number, teamId: number, memberId: number, type: string): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/RemoveMemberOrTeamFromStepChallenge", { StepchallangeID: challangeID, teamId: teamId, MemberId: memberId, challengeTeamType: type })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    GetTeamEmailTemplate(challengeId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetEmailTemplate", { StepchallangeID: challengeId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    SearchMemberByEmail(challengeId: number, corporateId: number, Email: string): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/SearchMemberByEmail", { StepchallangeID: challengeId, corporateId: corporateId, memberEmail: Email })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    SearchMemberByExcel(challengeId: number, corporateId: number, ExcelFileName: string, ExcelFile: string): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetTeamMembersFromExcel", { StepchallangeID: challengeId, corporateId: corporateId, excelFile: ExcelFile, excelFileName: ExcelFileName })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    EnrollMembers(Action: string, CorporateId: number, ChallangeID: number, EmailSubject: string, EmailDisplayName: string, EmailTemplate: string, memberId: number, IsSendEmail: boolean): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/SaveEnroll_AllIndividualUser", { action: Action, corporateId: CorporateId, StepchallangeID: ChallangeID, emailSubject: EmailSubject, emailDisplayName: EmailDisplayName, emailTemplate: EmailTemplate, created_byId:memberId, isSendEmail: IsSendEmail })
            .map(result => result.json())
            .catch(error => {
                return error;
            })
    }

    EnrollMemberByExcel(Action: string, CorporateId: number, ChallangeID: number, ExcelFile: string, ExcelFileName: string, EmailSubject: string, EmailDisplayName: string, EmailTemplate: string, memberId: number, IsSendEmail: boolean): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/SaveEnroll_SelectedIndividualUser", { action: Action, corporateId: CorporateId, StepchallangeID: ChallangeID, excelFile: ExcelFile, excelFileName: ExcelFileName,  emailSubject: EmailSubject, emailDisplayName: EmailDisplayName, emailTemplate: EmailTemplate, created_byId: memberId, isSendEmail: IsSendEmail })
            .map(result => result.json())
            .catch(error => {
                return error;
            })
    }

    GetEnrolledMembersListById(challangeID: number, corporateId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetEnrolledMembersByStepChallengeId", { StepchallangeID: challangeID, corporateId: corporateId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    GetTotalRegisteredMembers(corporateId: number): Observable<any> {
        return this.http.post(Constants.API_URL + "StepChallenge/GetTotalCountMemberByCorporate", {corporateId: corporateId })
            .map(result => result.json())
            .catch(error => {
                return error;
            });
    }

    setStepChallenge(value: any): void {
        this.stepChallenge = value;
    }
    getStepChallenge(): any {
        return this.stepChallenge;
    }

    getStep(value: string): void {
        this._step.next(value);
    }

    notify(): Observable<string> {
        return this._step.asObservable();
    }
}