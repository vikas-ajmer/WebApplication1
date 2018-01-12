
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from "ngx-bootstrap"
import { ToastyModule } from 'ng2-toasty';
import { CKEditorModule } from 'ng2-ckeditor';
import { LoadingModule, ANIMATION_TYPES } from 'ngx-loading';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

//services
import { AuthService } from './services/auth.service';
import { AuthGuard } from './services/auth-guard.service';
import { LocalStoreManager } from './services/local-store-manager.service';
import { AppTitleService } from './services/app-title.service';
import { DashboardService } from './services/dashboard.service';
import { ErrorLogService } from './services/error.log.service';
import { CorporateService } from './services/corporate.service';
import { LoadingService } from './services/loader.service';
import { UserService } from './services/user.service';
import { ChallengeService } from './services/challenge.service';
import { StepChallengeService } from './services/step-challenge.service';
import { UserProfileService } from './services/user-profile.service';
import { StoreService } from './services/store.service';
import { ReportService } from './services/report.service';
import { RegisterUsersService } from './services/registerusers.service';

//services

//pipes
import { SearchFilterPipe } from './pipe/search-filter.pipe';

import { AppComponent } from './components/app/app.component';

//menu
import { NavMenuComponent } from './components/navmenu/navmenu.component';
import { LeftMenuComponent } from './components/leftmenu/leftmenu.component';
//menu

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { Unauthorised } from './components/unauthorised/unauthorised.component';

//corporate
import { CorporateComponent } from './components/corporate/corporate.component';
import { AddCorporateComponent } from './components/corporate/add-corporate/add-corporate.component';
import { CorporateDetailComponent } from './components/corporate/corporate-detail/corporate-detail.component';
import { BasicDetailComponent } from './components/corporate/add-corporate/tabs/basic-detail.component';
import { SelectFeatureComponent } from './components/corporate/add-corporate/tabs/select-feature.component';
import { ImportuserComponent } from './components/corporate/add-corporate/tabs/import-user.component';
import { AddCorporateEmpComponent } from './components/corporate/corporate-detail/corporate-add-emp.component';
import { DeleteCorporateEmpComponent } from './components/corporate/corporate-detail/corporate-delete-emp.component';

//Challenges

import { ChallengeComponent } from './components/challenges/challenges.component';
import { AddChallengeComponent } from './components/challenges/add-challenge.component';
//individual Challenge
import { IndividualChallengeComponent } from './components/challenges/individual/individual-challenge-detail.component';
import { IndividualEnrollMemberComponent } from './components/challenges/individual/individual-enroll-member.component';
import { IndividualSendInvitationComponent } from './components/challenges/individual/individual-challenge-sendinvitation.component';

//adventure challenge
import { AdventureChallengeComponent } from './components/challenges/Adventure/adventure-detail.component';
import { AdventureCreateComponent } from './components/challenges/Adventure/adventure-create.component';
import { AdventureSetDetailsComponent } from './components/challenges/Adventure/adventure-setdetails.component';
import { AdventureAssignCorporateComponent } from './components/challenges/Adventure/adventure-assigncorporate.component';
import { AssignCorporateEnrollTeamsComponent } from './components/challenges/Adventure/assigncorporate-enrollteams.component';

//team challenge
import { TeamChallengeDetailComponent } from './components/challenges/Team/team-challenge-detail.component';
import { TeamChallengeEnrollComponent } from './components/challenges/Team/team-challenge-enroll.component';
import { TeamSendInvitationComponent } from './components/challenges/Team/team-challenge-sendinvitation.component';

//step challenge
import { StepChallengePreviousListComponent } from './components/challenges/StepChallenge/step-challenge-previouslist.component';
import { StepChallengeCreateComponent } from './components/challenges/StepChallenge/step-challenge-create.component';
import { StepChallengeEnrollTeamComponent } from './components/challenges/StepChallenge/step-challenge-enrollteams.component';
import { StepChallengeEnrollUserComponent } from './components/challenges/StepChallenge/step-challenge-enrollusers.component';

//Challenge Ends

// Store..
import { OrderHistoryComponent } from './components/store/order-history.component';

//controles
import { SearchBoxComponent } from './components/controles/search-box.component';
import { DeleteImportUserComponent } from './components/controles/delete-user-import.component';

//corporate

//user
import { UserComponent } from './components/users/user.component';
//user

//user profile
import { UserProfileComponent } from './components/user-profile/user-profile.component';
//user profile

import { AvatarModule } from "ng2-avatar";

//fileupload
import { Ng4FilesClickComponent, Ng4FilesDropComponent } from './directives/file-upload/components';
import { Ng4FilesService, Ng4FilesUtilsService } from './directives/file-upload/services';
import { OnlyNumber } from "./directives/onlyNumber.directive";
import { CountoDirective } from "./directives/counter.directive";

//Reports
import { StaticReportComponent } from "./components/reports/static-report.component";
// Admin Users
import { AdminUsersComponent } from './components/registerusers/users-list.component';
import { AddUserComponent } from './components/registerusers/add-user.component';



@NgModule({
    declarations: [
        AppComponent,
        NavMenuComponent,
        HomeComponent,
        LoginComponent,
        CorporateComponent,
        AddCorporateComponent,
        CorporateDetailComponent,
        AddCorporateEmpComponent,
        DeleteCorporateEmpComponent,
        DeleteImportUserComponent,
        BasicDetailComponent,
        SelectFeatureComponent,
        ImportuserComponent,
        LeftMenuComponent,
        NotFoundComponent,
        Unauthorised,
        SearchBoxComponent,
        Ng4FilesClickComponent,
        Ng4FilesDropComponent,
        UserComponent,
        ChallengeComponent,
        AddChallengeComponent,
        IndividualChallengeComponent,
        IndividualEnrollMemberComponent,
        IndividualSendInvitationComponent,
        AdventureChallengeComponent,
        AdventureCreateComponent,
        AdventureSetDetailsComponent,
        TeamChallengeDetailComponent,
        TeamChallengeEnrollComponent,
        TeamSendInvitationComponent,
        AdventureAssignCorporateComponent,
        StepChallengePreviousListComponent,
        StepChallengeCreateComponent,
        StepChallengeEnrollTeamComponent,
        StepChallengeEnrollUserComponent,
        UserProfileComponent,
        OnlyNumber,
        CountoDirective,
        AssignCorporateEnrollTeamsComponent,
        OrderHistoryComponent,
        AdminUsersComponent,
        SearchFilterPipe,
        AddUserComponent,
        StaticReportComponent
    ],
    imports: [
        CommonModule,
        HttpModule,
        FormsModule,
        BrowserModule,
        AvatarModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        PaginationModule.forRoot(),
        ToastyModule.forRoot(),
        ModalModule.forRoot(),
        CKEditorModule,
        LoadingModule.forRoot({
            animationType: ANIMATION_TYPES.threeBounce
        }),
        AngularMultiSelectModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyBYFnqTBoKVW2rZWwtqEYm5bamCr7dJRyI',
            libraries: ["places"]
        }),
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: "", component: HomeComponent, canActivate: [AuthGuard], data: { title: "Home" } },
            { path: "login", component: LoginComponent, data: { title: "Login" } },
            { path: "corporate", component: CorporateComponent, canActivate: [AuthGuard], data: { title: "Corporate-List" } },
            { path: "corporate/add", component: AddCorporateComponent, canActivate: [AuthGuard], data: { title: "Add-Corporate" } },
            { path: "corporate/add/:id", component: AddCorporateComponent, canActivate: [AuthGuard], data: { title: "Edit-Corporate" } },
            { path: "corporate/view/:id", component: CorporateDetailComponent, canActivate: [AuthGuard], data: { title: "View-Corporate" } },
            { path: "corporate/add-employee/:id", component: AddCorporateEmpComponent, canActivate: [AuthGuard], data: { title: "Add-Corporate-Employee" } },
            { path: "corporate/delete-employee/:id", component: DeleteCorporateEmpComponent, canActivate: [AuthGuard], data: { title: "Delete-Corporate-Employee" } },
            { path: "users", component: UserComponent, canActivate: [AuthGuard], data: { title: "Users" } },
            { path: "challenges", component: ChallengeComponent, canActivate: [AuthGuard], data: { title: "Challenge-List" } },
            { path: "challenge/add", component: AddChallengeComponent, canActivate: [AuthGuard], data: { title: "Add-Challenge" } },
            { path: "challenge/add/individual", component: AddChallengeComponent, canActivate: [AuthGuard], data: { title: "Add-Challenge" } },
            { path: "userprofile/view/:id", component: UserProfileComponent, canActivate: [AuthGuard], data: { title: "User Profile" } },
            { path: "un-authorise-page", component: Unauthorised, data: { title: "Un-authorised" } },
            { path: "home", redirectTo: "/", pathMatch: "full" },
            { path: "challenge/adventure-assigncorporate/:adventureid", component: AdventureAssignCorporateComponent, canActivate: [AuthGuard], data: { title: "Adventure-Assign-Corporate" } },
            { path: "challenge/adventure-assigncorporate/:adventureid/:acorporate_id", component: AdventureAssignCorporateComponent, canActivate: [AuthGuard], data: { title: "Adventure-Assign-Corporate" } },
            { path: "challenge/adventure-create/:id", component: AdventureCreateComponent, canActivate: [AuthGuard], data: { title: "Adventure-Assign-Corporate" } },
            { path: "challenge/adventure-setdetails/:id", component: AdventureSetDetailsComponent, canActivate: [AuthGuard], data: { title: "Adventure-Assign-Corporate" } },
            { path: "challenge/step-challenge/create/:id", component: StepChallengeCreateComponent, canActivate: [AuthGuard], data: { title: "Step Challenge Create" } },
            { path: "challenge/step-challenge/previous", component: StepChallengePreviousListComponent, canActivate: [AuthGuard], data: { title: "Step Challenge" } },
            { path: "order-history", component: OrderHistoryComponent, canActivate: [AuthGuard], data: { title: "Order History" } },
            { path: "reports", component: StaticReportComponent, canActivate: [AuthGuard], data: { title: "Report" } },
            { path: "registerusers", component: AdminUsersComponent, canActivate: [AuthGuard], data: { title: "Admin Users" } },
            { path: "registerusers/add", component: AddUserComponent, canActivate: [AuthGuard], data: { title: "Add-User" } },
            { path: "registerusers/add/:id", component: AddUserComponent, canActivate: [AuthGuard], data: { title: "Edit-User" } },
            { path: "**", component: NotFoundComponent, data: { title: "Page Not Found" } }

        ]),
        //typeadhead
        TypeaheadModule,
        BsDatepickerModule.forRoot()
    ],
    providers: [
        AuthService, AuthGuard,
        LocalStoreManager,
        AppTitleService,
        DashboardService,
        ErrorLogService,
        CorporateService,
        LoadingService,
        Ng4FilesService,
        Ng4FilesUtilsService,
        UserService,
        ChallengeService,
        StepChallengeService,
        UserProfileService,
        GoogleMapsAPIWrapper,
        ReportService,
        StoreService,
        RegisterUsersService
    ]
})
export class AppModuleShared {
}
