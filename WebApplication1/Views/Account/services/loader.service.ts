import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { Utilities} from './Utilities';
@Injectable()
export class LoadingService {
    private _loading = new Subject<boolean>();
    private messages = new Subject<AlertMessage>();
    private stickyMessages = new Subject<AlertMessage>();
    showLoader(val: boolean): void {
        this._loading.next(val);
    }

    showMessage(summary: string):void
    showMessage(summary: string, detail: string, severity: MessageSeverity):void
    showMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity):void
    showMessage(response: Response, ignoreValue_useNull: string, severity: MessageSeverity):void
    showMessage(data: any, separatorOrDetail?: string, severity?: MessageSeverity) {

        if (!severity)
            severity = MessageSeverity.default;

        if (data instanceof Response) {
            data = Utilities.getHttpResponseMessage(data);
            separatorOrDetail = Utilities.captionAndMessageSeparator;
        }

        if (data instanceof Array) {
            for (let message of data) {
                let msgObject = Utilities.splitInTwo(message, separatorOrDetail||"");

                this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, false);
            }
        }
        else {
            this.showMessageHelper(data, separatorOrDetail || "", severity, false);
        }
    }


    showStickyMessage(summary: string):void
    showStickyMessage(summary: string, detail: string, severity: MessageSeverity, error?: any):void
    showStickyMessage(summaryAndDetails: string[], summaryAndDetailsSeparator: string, severity: MessageSeverity):void
    showStickyMessage(response: Response, ignoreValue_useNull: string, severity: MessageSeverity):void
    showStickyMessage(data: string | string[] | Response, separatorOrDetail?: string, severity?: MessageSeverity, error?: any) {

        if (!severity)
            severity = MessageSeverity.default;

        if (data instanceof Response) {
            data = Utilities.getHttpResponseMessage(data);
            separatorOrDetail = Utilities.captionAndMessageSeparator;
        }


        if (data instanceof Array) {
            for (let message of data) {
                let msgObject = Utilities.splitInTwo(message, separatorOrDetail || "");

                this.showMessageHelper(msgObject.firstPart, msgObject.secondPart, severity, true);
            }
        }
        else {

            if (error) {

                let msg = `Severity: "${MessageSeverity[severity]}", Summary: "${data}", Detail: "${separatorOrDetail}", Error: "${Utilities.safeStringify(error)}"`;
                
            }

            this.showMessageHelper(data, separatorOrDetail || "", severity, true);
        }
    }



    private showMessageHelper(summary: string, detail: string, severity: MessageSeverity, isSticky: boolean) {

        if (isSticky)
            this.stickyMessages.next({ severity: severity, summary: summary, detail: detail });
        else
            this.messages.next({ severity: severity, summary: summary, detail: detail });
    }

    notify(): Observable<boolean> {
        return this._loading.asObservable();
    }
    getMessageEvent(): Observable<AlertMessage> {
        return this.messages.asObservable();
    }

    getStickyMessageEvent(): Observable<AlertMessage> {
        return this.stickyMessages.asObservable();
    }
}

export class AlertMessage {
    constructor(public severity: MessageSeverity, public summary: string, public detail: string) { }
}

export enum MessageSeverity {
    default,
    info,
    success,
    error,
    warn,
    wait
}