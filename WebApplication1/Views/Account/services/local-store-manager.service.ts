import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Utilities } from './Utilities';

@Injectable()
export class LocalStoreManager {

    public static readonly DBKEY_USER_DATA = "user_data";
    private static readonly DBKEY_SYNC_KEYS = "sync_keys";
    private initEvent = new Subject();
    private static syncListenerInitialised = false;
    private syncKeys: string[] = [];

    public clearAllStorage() {

        this.clearAllSessionsStorage();
        this.clearLocalStorage();
    }

    public clearAllSessionsStorage() {
        sessionStorage.clear();
    }

    public clearLocalStorage() {
        localStorage.clear();
    }

    private addToSessionStorage(data: any, key: string) {
        this.sessionStorageSetItem(key, data);
    }
    
    private removeFromSessionStorage(keyToRemove: string) {
        sessionStorage.removeItem(keyToRemove);
    }

    public saveSessionData(data: any, key = LocalStoreManager.DBKEY_USER_DATA) {
        localStorage.removeItem(key);
        this.sessionStorageSetItem(key, data);
    }
    public initialiseStorageSyncListener() {
        if (LocalStoreManager.syncListenerInitialised == true)
            return;

        LocalStoreManager.syncListenerInitialised = true;
        window.addEventListener("storage", this.sessionStorageTransferHandler, false);
        this.syncSessionStorage();
    }
    private syncSessionStorage() {

        localStorage.setItem('getSessionStorage', '_dummy');
        localStorage.removeItem('getSessionStorage');
    }

    private sessionStorageTransferHandler = (event: StorageEvent) => {

        if (!event.newValue)
            return;

        if (event.key == 'getSessionStorage') {

            if (sessionStorage.length) {
                this.localStorageSetItem('setSessionStorage', sessionStorage);
                localStorage.removeItem('setSessionStorage');
            }
        }
        else if (event.key == 'setSessionStorage') {

            if (!this.syncKeys.length)
                this.loadSyncKeys();

            let data = JSON.parse(event.newValue);
            //console.info("Set => Key: Transfer setSessionStorage" + ",  data: " + JSON.stringify(data));

            for (let key in data) {

                if (this.syncKeysContains(key))
                    this.sessionStorageSetItem(key, JSON.parse(data[key]));
            }

            this.onInit();
        }
        else if (event.key == 'addToSessionStorage') {

            let data = JSON.parse(event.newValue);

            //console.warn("Set => Key: Transfer addToSessionStorage" + ",  data: " + JSON.stringify(data));

            this.addToSessionStorageHelper(data["data"], data["key"]);
        }
        else if (event.key == 'removeFromSessionStorage') {

            this.removeFromSessionStorageHelper(event.newValue);
        }
        else if (event.key == 'clearAllSessionsStorage' && sessionStorage.length) {

            this.clearInstanceSessionStorage();
        }
        else if (event.key == 'addToSyncKeys') {

            this.addToSyncKeysHelper(event.newValue);
        }
        else if (event.key == 'removeFromSyncKeys') {

            this.removeFromSyncKeysHelper(event.newValue);
        }
    }

    private addToSessionStorageHelper(data: any, key: string) {

        this.addToSyncKeysHelper(key);
        this.sessionStorageSetItem(key, data);
    }

    private loadSyncKeys() {

        if (this.syncKeys.length)
            return;

        this.syncKeys = this.getSyncKeysFromStorage();
    }

    private removeFromSessionStorageHelper(keyToRemove: string) {

        sessionStorage.removeItem(keyToRemove);
        this.removeFromSyncKeysHelper(keyToRemove);
    }

    public clearInstanceSessionStorage() {

        sessionStorage.clear();
        this.syncKeys = [];
    }

    private addToSyncKeysHelper(key: string) {

        if (!this.syncKeysContains(key))
            this.syncKeys.push(key);
    }

    private removeFromSyncKeysHelper(key: string) {

        let index = this.syncKeys.indexOf(key);

        if (index > -1) {
            this.syncKeys.splice(index, 1);
        }
    }

    private syncKeysContains(key: string) {

        return this.syncKeys.some(x => x == key);
    }

    private getSyncKeysFromStorage(defaultValue: string[] = []): string[] {

        let data = this.localStorageGetItem(LocalStoreManager.DBKEY_SYNC_KEYS);

        if (data == null)
            return defaultValue;
        else
            return <string[]>data;
    }

    public deinitialiseStorageSyncListener() {

        window.removeEventListener("storage", this.sessionStorageTransferHandler, false);

        LocalStoreManager.syncListenerInitialised = false;
    }

    public savePermanentData(data: any, key = LocalStoreManager.DBKEY_USER_DATA) {
        this.removeFromSessionStorage(key);
        this.localStorageSetItem(key, data);
    }
    public saveSyncedSessionData(data: any, key = LocalStoreManager.DBKEY_USER_DATA) {
        localStorage.removeItem(key);
        this.addToSessionStorage(data, key);
    }
    private localStorageSetItem(key: string, data: any) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    private sessionStorageSetItem(key: string, data: any) {
        sessionStorage.setItem(key, JSON.stringify(data));
    }

    private localStorageGetItem(key: string) {
        return Utilities.JSonTryParse(localStorage.getItem(key));
    }

    private sessionStorageGetItem(key: string) {
        return Utilities.JSonTryParse(sessionStorage.getItem(key));
    }

    public deleteData(key = LocalStoreManager.DBKEY_USER_DATA) {
        this.removeFromSessionStorage(key);
        localStorage.removeItem(key);
    }

    public getData(key = LocalStoreManager.DBKEY_USER_DATA) {

        let data = this.sessionStorageGetItem(key);

        if (data == null)
            data = this.localStorageGetItem(key);

        return Utilities.DeryptData(data);
    }


    public getDataObject<T>(key = LocalStoreManager.DBKEY_USER_DATA): T {

        let data = this.getData(key);
        return <T>Utilities.JSonTryParse(data);
    }

    private onInit() {
        setTimeout(() => {
            this.initEvent.next();
            this.initEvent.complete();
        });
    }


    public getInitEvent(): Observable<{}> {
        return this.initEvent.asObservable();
    }

}