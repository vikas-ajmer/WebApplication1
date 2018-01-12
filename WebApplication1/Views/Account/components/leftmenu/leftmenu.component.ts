import { Component ,OnInit } from '@angular/core';
import { MenuItems } from '../../services/menuitems'
import { AuthGuard} from'../../services/auth-guard.service';

@Component({
    selector: 'left-menu',
    templateUrl: './leftmenu.component.html',
    styleUrls: []
})
export class LeftMenuComponent implements OnInit {
    currentActiveUrl:string='/'
    ngOnInit(): void {
        this.menuItems = MenuItems.SIDEBAR_MENUITEMS[0].MenuItems;
    }

    public menuItems: any;

    constructor(private auth: AuthGuard) {
        this.auth.notify().subscribe(res => {
            this.currentActiveUrl = res;
        });
    }

    getActiveMenu(menuUrl: string) {
        if (menuUrl == "/") {
            return this.currentActiveUrl==menuUrl;
        }
        else {
            return this.currentActiveUrl.includes(menuUrl);
        }
    }

}
