import { Component } from '@angular/core';
import { AuthService } from "../../services/auth.service";

@Component({
    selector: 'nav-menu',
    templateUrl: './navmenu.component.html',
    styleUrls: []
})
export class NavMenuComponent {
    isToggle: boolean = false;
    CurrentUser: any = {};
    constructor(private authService: AuthService) {
        this.CurrentUser = authService.currentUser;
    }
    ToggleLeftBar() {
        document.body.classList.toggle("leftbar-collapsed");
        this.isToggle = !this.isToggle;
    }
    logout() {
        this.authService.logout();
        this.authService.redirectLogoutUser();
    }
}
