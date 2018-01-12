import { Component, OnInit, OnDestroy, Input } from "@angular/core";

import { UserLogin } from '../../models/user-login.model';
import { AuthService } from "../../services/auth.service";
import { Utilities } from "../../services/Utilities";
import { ErrorLogService } from "../../services/error.log.service";
import { LoadingService, MessageSeverity } from "../../services/loader.service";
var $: any = require("jquery");
@Component({
    selector: "app-login",
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

    userLogin = new UserLogin('', '', false);
    loginStatusSubscription: any;

    constructor(private authService: AuthService, private errorLog: ErrorLogService, private loadingService: LoadingService) {

    }
    
    ngOnInit() {
        this.userLogin.rememberMe = this.authService.rememberMe;
        if (this.getShouldRedirect()) {
            this.authService.redirectLoginUser();
        }
        else {
            this.loginStatusSubscription = this.authService.getLoginStatusEvent().subscribe(isLoggedIn => {
                if (this.getShouldRedirect()) {
                    this.authService.redirectLoginUser();
                }
            });
        }
    }

    getShouldRedirect() {
        return this.authService.isLoggedIn;
    }

    login() {
        this.loadingService.showLoader(true);
        this.authService.login(this.userLogin.email, this.userLogin.password, this.userLogin.rememberMe)
            .subscribe(
            user => {
                if (user.MemberID == "0" || user.MemberID == null)
                    this.loadingService.showMessage('', "Username and password does not match.", MessageSeverity.error);
                this.loadingService.showLoader(false);
            },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage(Utilities.noNetworkMessageCaption, Utilities.noNetworkMessageDetail, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "login").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error,false);
                    if (errorMessage)
                        this.loadingService.showMessage("Unable to login", errorMessage, MessageSeverity.error);
                    else {
                        this.loadingService.showMessage("Unable to login", "An error occured whilst logging in, please try again later. ", MessageSeverity.error);
                        errorMessage = "An error occured whilst logging in, please try again later.";
                    }
                    this.errorLog.WriteError(errorMessage, "login").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    toggleForm() {
        $("form").animate({
            height: "toggle",
            'padding-top': 'toggle',
            'padding-bottom': 'toggle',
            opacity: "toggle"
        }, "slow");
    }
}