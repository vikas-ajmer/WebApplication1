import { Injectable } from '@angular/core';
import { Response } from '@angular/http';
import { Constants } from './constants';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/filter';
var CryptoJS: any = require("crypto-js");
import swal from 'sweetalert';

@Injectable()
export class Utilities {

    public static readonly defaultHomeUrl: string = "/";

    public static readonly captionAndMessageSeparator = ":";
    public static readonly noNetworkMessageCaption = "No Network";
    public static readonly noNetworkMessageDetail = "The server cannot be reached";
    public static readonly accessDeniedMessageCaption = "Access Denied!";
    public static readonly accessDeniedMessageDetail = "";
    constructor() { }
    public static getHttpResponseMessage(data: Response | any): string[] {

        let responses: string[] = [];

        if (data instanceof Response) {

            if (this.checkNoNetwork(data)) {
                responses.push(`${this.noNetworkMessageCaption}${this.captionAndMessageSeparator} ${this.noNetworkMessageDetail}`);
            }
            else {
                try {
                    let responseObject = data.json();

                    if (typeof responseObject === 'object' || responseObject instanceof Object) {

                        for (let key in responseObject) {
                            if (key)
                                responses.push(`${key}${this.captionAndMessageSeparator} ${responseObject[key]}`);
                            else if (responseObject[key])
                                responses.push(responseObject[key].toString());
                        }
                    }
                }
                catch (error) {
                }
            }

            if (!responses.length && data.text())
                responses.push(`${data.statusText}: ${data.text()}`);
        }

        if (!responses.length)
            responses.push(data.toString());

        if (this.checkAccessDenied(data))
            responses.splice(0, 0, `${this.accessDeniedMessageCaption}${this.captionAndMessageSeparator} ${this.accessDeniedMessageDetail}`);


        return responses;
    }


    public static findHttpResponseMessage(messageToFind: string, data: Response | any, seachInCaptionOnly = true, includeCaptionInResult = false): string {

        let searchString = messageToFind.toLowerCase();
        let httpMessages = this.getHttpResponseMessage(data);

        for (let message of httpMessages) {
            let fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);

            if (fullMessage.firstPart && fullMessage.firstPart.toLowerCase().indexOf(searchString) != -1) {
                return includeCaptionInResult ? message : fullMessage.secondPart || fullMessage.firstPart;
            }
        }

        if (!seachInCaptionOnly) {
            for (let message of httpMessages) {

                if (message.toLowerCase().indexOf(searchString) != -1) {
                    if (includeCaptionInResult) {
                        return message;
                    }
                    else {
                        let fullMessage = Utilities.splitInTwo(message, this.captionAndMessageSeparator);
                        return fullMessage.secondPart || fullMessage.firstPart;
                    }
                }
            }
        }

        return "";
    }

    public static checkNoNetwork(response: Response) {
        if (response instanceof Response) {
            return response.status == 0;
        }

        return false;
    }

    public static checkAccessDenied(response: Response) {
        if (response instanceof Response) {
            return response.status == 403;
        }

        return false;
    }

    public static checkNotFound(response: Response) {
        if (response instanceof Response) {
            return response.status == 404;
        }

        return false;
    }

    public static toTitleCase(text: string) {
        return text.replace(/\w\S*/g, (subString) => {
            return subString.charAt(0).toUpperCase() + subString.substr(1).toLowerCase();
        });
    }

    public static getQueryParamsFromString(paramString: string) {

        if (!paramString)
            return null;

        let params: { [key: string]: string } = {};

        for (let param of paramString.split("&")) {
            let keyValue = Utilities.splitInTwo(param, "=");
            params[keyValue.firstPart] = keyValue.secondPart;
        }

        return params;
    }

    public static splitInTwo(text: string, separator: string): { firstPart: string, secondPart: string } {
        let separatorIndex = text.indexOf(separator);

        if (separatorIndex == -1)
            return { firstPart: text, secondPart: "" };

        let part1 = text.substr(0, separatorIndex).trim();
        let part2 = text.substr(separatorIndex + 1).trim();

        return { firstPart: part1, secondPart: part2 };
    }

    public static safeStringify(object: any) {

        let result: string;

        try {
            result = JSON.stringify(object);
            return result;
        }
        catch (error) {

        }

        let simpleObject: any;

        for (let prop in object) {
            if (!object.hasOwnProperty(prop)) {
                continue;
            }
            if (typeof (object[prop]) == 'object') {
                continue;
            }
            if (typeof (object[prop]) == 'function') {
                continue;
            }
            simpleObject[prop] = object[prop];
        }

        result = "[***Sanitized Object***]: " + JSON.stringify(simpleObject);

        return result;
    }

    public static JSonTryParse(value: any) {
        try {
            return JSON.parse(value);
        }
        catch (e) {
            if (value === "undefined")
                return void 0;

            return value;
        }
    }

    public static EncryptData(data: any): any {
        var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), Constants.CRYPTO_SECRET_KEY);
        return ciphertext.toString();
    }

    public static DeryptData(data: any): any {
        if (data != null) {
            var bytes = CryptoJS.AES.decrypt(data, Constants.CRYPTO_SECRET_KEY);
            var decryptedData = bytes.toString(CryptoJS.enc.Utf8);
            return decryptedData;
        }
        return data;
    }

    public static GetuserRoleByRoleId(RoleId: any): string {
        let role: string = "";
        switch (RoleId) {
            case "1":
            case 1:
                role = "ADMIN";
                break;
            case "2":
            case 2:
                role = "ACCOUNT MANAGER";
                break;
            case "3":
            case 3:
                role = "CORPORATE MANAGER";
                break;
            case "4":
            case 4:
                role = "MODERATOR";
                break;
            case "5":
            case 5:
                role = "SUPPORT";
                break;
            case "6":
            case 6:
                role = "IT";
                break;
            case "7":
            case 7:
                role = "ACCOUNT EXECUTIVE";
                break;
        }
        return role;
    }
    public static ShowErrorAlert(Title: string, Msg: string, Type: string): void {
        swal(Title, Msg, Type);
    }
}