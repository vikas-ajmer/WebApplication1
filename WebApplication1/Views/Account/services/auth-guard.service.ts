import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AuthService } from './auth.service';
import { MenuItems } from './menuitems';
import { Utilities } from './Utilities';


@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    private activeurl = new Subject<string>();
    constructor(private authService: AuthService, private router: Router) { }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.checkLogin(url, Object.keys(route.params).length);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {
        let url = `/${route.path}`;
        return this.checkLogin(url);
    }

    CheckAuthorisation(url: string, param: number): boolean {
        if (param != 0)
        {
            let urlArray = url.split('/');
            let arrlength = urlArray.length;
            let removeIndex = arrlength - param;
            urlArray.splice(removeIndex, param);
            url=urlArray.join('/');
        }
        this.activeurl.next(url);
        let currentRole = this.authService.currentUserRole;
        let Menu = MenuItems.AuthorisedURLs;
        var _find = Menu.find((obj) => obj.url == url);
        if (_find && _find.Roles.indexOf(currentRole, 0) > -1)
            return true;
        else
            return false;
    }

    checkLogin(url: string,param:number=0): boolean {
        if (this.authService.isLoggedIn) {
            if (this.CheckAuthorisation(url, param)||url=="/") {
                return true;
            }
            else {
                this.router.navigate(['/un-authorise-page']);
                return false;
            }
        }
        this.router.navigate(['/login']);

        return false;
    }
    notify(): Observable<string> {
        return this.activeurl.asObservable();
    }
}