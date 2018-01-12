import { Component, ElementRef, NgModule, NgZone, OnInit, ViewChild, ViewEncapsulation, Input } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { MapsAPILoader, GoogleMapsAPIWrapper } from '@agm/core';

//import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { ChallengeService } from '../../../services/challenge.service';
import { ErrorLogService } from "../../../services/error.log.service";
import { Utilities } from "../../../services/Utilities";
import { Constants } from "../../../services/constants";
import { LoadingService, MessageSeverity } from "../../../services/loader.service";
import { AuthService } from "../../../services/auth.service";
import { Ng4FilesStatus, Ng4FilesSelected, Ng4FilesService, Ng4FilesConfig, } from '../../../directives/file-upload/index';
import { AdventureChallenge } from '../../../models/challenge.model';

@Component({
    selector: 'adventure-setdetails',
    templateUrl: './adventure-setdetails.component.html',
    styleUrls: ['./adventure-setdetails.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AdventureSetDetailsComponent implements OnInit {

    adventureList: any;
    @Input() UserId: number = 0;
    configImage: Ng4FilesConfig = {
        acceptExtensions: ['jpg', 'jpeg', 'png'],
        maxFilesCount: 1,
        maxFileSize: 500000,
        totalFilesSize: 500000
    };
    title: string = 'Google Maps Addeed Successfully';
    latitude: number = 0;
    longitude: number = 0;
    public zoom: number;

    adventurestartlocation: string = "";
    adventureendlocation: string = "";

    startLatitude: number;
    startLongtitude: number;
    endLatitude: number;
    endLongtitude: number;

    directionsService: any;
    request: any;
    directionsDisplay: any;
    service: any;

    steps: number;
    AdventureId: number = 0;
    IsCorrectInput: boolean = false;
    totalDistance: number;

    public adventureChallenge = new AdventureChallenge(0, "", "", 0, 0, 0, 0, "", "", false, 0, "", "", "", 0);

    constructor(private router: Router, private route: ActivatedRoute, private challengeService: ChallengeService,
        private errorLog: ErrorLogService, private loadingService: LoadingService, private authService: AuthService,
        private ng4FilesService: Ng4FilesService, private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private googleMapsAPIWrapper: GoogleMapsAPIWrapper) {
        
        let id = this.route.snapshot.paramMap.get('id');
        if (id != null && id != "") {
            this.AdventureId = parseInt(id);
        }
        else {

        }
    }

    ngOnInit() {
        this.ng4FilesService.addConfig(this.configImage, 'shared');
        //set current position
        this.setCurrentPosition();
        //Getting Adventure Info
        setTimeout(() => {this.GetAdventureDetail();  }, 100);              
    }
    private setCurrentPosition() {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                this.zoom = 12;
            });
        }
    }
    LoadMap() {
        //load Places Autocomplete
        this.mapsAPILoader.load().then(() => {
            let autocompleteStart = new window['google'].maps.places.Autocomplete(document.getElementById("us2-address"));
            autocompleteStart.addListener("place_changed", () => {
                this.ngZone.run(() => {

                    //get the place result
                    let place: any = autocompleteStart.getPlace();
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    //set start latitude, longitude and zoom
                    this.adventureChallenge.StartLatitude = place.geometry.location.lat();
                    this.adventureChallenge.StartLongtitude = place.geometry.location.lng();
                    this.adventureChallenge.AdventureStartLocation = place.formatted_address;

                    this.zoom = 12;
                });
            });

            let autocompleteEnd = new window['google'].maps.places.Autocomplete(document.getElementById("us3-address"));
            autocompleteEnd.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    //get the place result
                    let place: any = autocompleteEnd.getPlace();
                    //verify result
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }
                    //set end latitude, longitude and zoom
                    this.adventureChallenge.EndLatitude = place.geometry.location.lat();
                    this.adventureChallenge.EndLongtitude = place.geometry.location.lng();
                    this.adventureChallenge.AdventureEndLocation = place.formatted_address;

                    this.zoom = 12;
                });
            });
        });
    }
    GoRoute() {      
        let $this = this;
        $this.loadingService.showLoader(true);  
        var map = new window['google'].maps.Map(document.getElementById('gMap'), {
            zoom: 7,
            center: { lat: 37.77, lng: -122.447 },
            mapTypeId: window['google'].maps.MapTypeId.HYBRID
        });
        this.directionsService = new window['google'].maps.DirectionsService();
        this.directionsDisplay = new window['google'].maps.DirectionsRenderer({ 'draggable': true });

        this.directionsDisplay.setMap(map);

        this.request = {
            origin: this.adventureChallenge.AdventureStartLocation,
            destination: this.adventureChallenge.AdventureEndLocation,
            waypoints: [],
            optimizeWaypoints: true,
            travelMode: window['google'].maps.TravelMode.WALKING
        };
        this.directionsService.route(this.request, function (response, status) {
            if (status == window['google'].maps.DirectionsStatus.OK) {
                $this.directionsDisplay.setDirections(response);
            }
        });

        this.service = new window['google'].maps.DistanceMatrixService();

        this.service.getDistanceMatrix({
            origins: [this.adventureChallenge.AdventureStartLocation],
            destinations: [this.adventureChallenge.AdventureEndLocation],
            travelMode: window['google'].maps.TravelMode.WALKING,
            unitSystem: window['google'].maps.UnitSystem.METRIC,
            avoidHighways: false,
            avoidTolls: false
        }, function (response, status) {
            if (status == window['google'].maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS" && response.rows[0].elements[0].status != "NOT_FOUND") {
                let totalDistance = response.rows[0].elements[0].distance.text;                
                $this.adventureChallenge.AdventureDistance = parseInt(totalDistance.split(' ')[0]);                
                $this.totalDistance = $this.adventureChallenge.AdventureDistance;
                if ($this.adventureChallenge.AdventureReturnWay == true) {
                    $this.totalDistance = $this.totalDistance * 2;
                }
                $this.loadingService.showLoader(false);
                $this.steps = ($this.totalDistance * (1.31 * 1000));
                $this.IsCorrectInput = true;

            } else {
                $this.loadingService.showLoader(false);
                $this.IsCorrectInput = false;
                $this.loadingService.showStickyMessage("error", "Unable to find the distance via road", MessageSeverity.error);
            }

        });
    }
    GetAdventureDetail() {
        this.adventureChallenge.Id = this.AdventureId;
        this.loadingService.showLoader(true);
        this.challengeService.GetAdventureChallenge(this.adventureChallenge).subscribe(
            res => {
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showStickyMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status > 0) {
                    console.log(res.result);

                    let startLatLong = res.result.Adventure_StartPoint;

                    if (res.result.Adventure_StartName != null && res.result.Adventure_StartName != "") {
                        this.adventureChallenge.AdventureStartLocation = res.result.Adventure_StartName;
                        this.adventureChallenge.AdventureEndLocation = res.result.Adventure_EndName;
                    }
                    else {
                        this.adventureChallenge.AdventureStartLocation = "";
                        this.adventureChallenge.AdventureEndLocation = "";
                    }
                    this.adventureChallenge.AdventureName = res.result.Adventure_Name;
                    this.adventureChallenge.AdventureDescription = res.result.Adventure_Descprition;
                    this.adventureChallenge.Image = res.result.Adventure_Image;
                    this.adventureChallenge.AdventureDistance = res.result.Adventure_Distance;
                    this.adventureChallenge.AdventureReturnWay = res.result.Adventure_IsReturnWay;

                    if (res.result.Adventure_StartPoint != null && res.result.Adventure_StartPoint != "") {
                        this.adventureChallenge.StartLatitude = res.result.Adventure_StartPoint.split(',')[0];
                        this.adventureChallenge.StartLongtitude = res.result.Adventure_StartPoint.split(',')[1];
                        this.adventureChallenge.EndLatitude = res.result.Adventure_EndPoint.split(',')[0];
                        this.adventureChallenge.EndLongtitude = res.result.Adventure_EndPoint.split(',')[1];
                    }
                    
                    this.adventureChallenge.AdventureIsActive = res.result.Adventure_IsActive;
                    this.adventureChallenge.AdventureCreateOn = res.result.Adventure_CreateOn;
                    this.adventureChallenge.AdventureCreateBy = res.result.Adventure_CreateBy;

                    this.loadingService.showLoader(false);
                    //debugger;

                    if (res.result.Adventure_StartName != null && res.result.Adventure_StartName != "" && res.result.Adventure_EndName != null && res.result.Adventure_EndName != "") {
                        this.LoadMap();
                        this.IsCorrectInput = true;
                    }
                    else {
                        this.LoadMap();
                        this.IsCorrectInput = false;
                    }
                    
                    if (res.result.Adventure_StartPoint != null && res.result.Adventure_StartPoint != "") {
                        this.GoRoute();
                    }
                    else {
                        this.IsCorrectInput = false;
                    }
                }
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveAdventureChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SaveAdventureChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            }
        );
    }

    SaveAdventureChallenge() {
        if (this.IsCorrectInput == false) {
            this.loadingService.showMessage("error", "Please choose correct start and end points.", MessageSeverity.error);
            return false;
        }
        //if (this.adventurestartlocation == undefined || this.adventurestartlocation == "undefined" || this.adventurestartlocation == "") {
        //    this.loadingService.showMessage("error", "Adventure start point is required", MessageSeverity.error);
        //    return false;
        //}
        //if (this.adventureendlocation == undefined || this.adventureendlocation == "undefined" || this.adventureendlocation == "") {
        //    this.loadingService.showMessage("error", "Adventure end point is required", MessageSeverity.error);
        //    return false;
        //}

        this.loadingService.showLoader(true);
        this.challengeService.UpdateAdventureChallenge(this.adventureChallenge).subscribe(
            res => {
                if (res.status == -1 || res.status == "-1") {
                    this.loadingService.showStickyMessage("error", res.error, MessageSeverity.error);
                }
                if (res.status > 0) {
                    this.loadingService.showMessage("success", "Adventure updated successfully", MessageSeverity.success);
                    this.router.navigate(["challenge/adventure-assigncorporate/" + res.Adventure_ID], { replaceUrl: true });
                }
                this.loadingService.showLoader(false);
            },
            error => {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                if (Utilities.checkNoNetwork(error)) {
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveAdventureChallenge").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error);
                    this.errorLog.WriteError(errorMessage, "SaveAdventureChallenge").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
        this.loadingService.showLoader(false);
    }
}
