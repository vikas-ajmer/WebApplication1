import { Component, OnInit } from '@angular/core';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';

import { LocalStoreManager } from '../../services/local-store-manager.service';
import { AppTitleService } from '../../services/app-title.service';
import { AuthService } from '../../services/auth.service';
import { LoadingService, AlertMessage, MessageSeverity } from '../../services/loader.service';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    appTitle = "CorporateAdmin";
    loading: boolean = false;
    stickyToasties: number[] = [];

    constructor(storageManager: LocalStoreManager, private appTitleService: AppTitleService,
        public authService: AuthService, private loadingService: LoadingService, private toastyService: ToastyService, private toastyConfig: ToastyConfig) {
        storageManager.initialiseStorageSyncListener();
        this.appTitleService.appName = this.appTitle;
        loadingService.notify().subscribe(res => { this.loading = res; });
        this.toastyConfig.theme = 'bootstrap';
        this.toastyConfig.position = 'top-right';
        this.toastyConfig.limit = 100;
        this.toastyConfig.showClose = true;
        loadingService.getMessageEvent().subscribe(message => this.showToast(message, false));
        loadingService.getStickyMessageEvent().subscribe(message => this.showToast(message, true));
    }

    showToast(message: AlertMessage, isSticky: boolean) {

        if (message == null) {
            for (let id of this.stickyToasties.slice(0)) {
                this.toastyService.clear(id);
            }

            return;
        }

        let toastOptions: ToastOptions = {
            title: message.summary,
            msg: message.detail,
            timeout: isSticky ? 0 : 4000
        };


        if (isSticky) {
            toastOptions.onAdd = (toast: ToastData) => this.stickyToasties.push(toast.id);

            toastOptions.onRemove = (toast: ToastData) => {
                let index = this.stickyToasties.indexOf(toast.id, 0);

                if (index > -1) {
                    this.stickyToasties.splice(index, 1);
                }
            };
        }


        switch (message.severity) {
            case MessageSeverity.default: this.toastyService.default(toastOptions); break
            case MessageSeverity.info: this.toastyService.info(toastOptions); break;
            case MessageSeverity.success: this.toastyService.success(toastOptions); break;
            case MessageSeverity.error: this.toastyService.error(toastOptions); break
            case MessageSeverity.warn: this.toastyService.warning(toastOptions); break;
            case MessageSeverity.wait: this.toastyService.wait(toastOptions); break;
        }
    }
}
