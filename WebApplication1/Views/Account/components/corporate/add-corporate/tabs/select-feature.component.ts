import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { CorporateService } from '../../../../services/corporate.service';
import { ErrorLogService } from "../../../../services/error.log.service";
import { Utilities } from "../../../../services/Utilities";
import { LoadingService, MessageSeverity } from "../../../../services/loader.service";
import { Constants } from "../../../../services/constants";
import { CorporateFeaturs } from "../../../../models/corporate.model";
@Component({
    selector: 'select-feature',
    templateUrl: './select-feature.component.html',
    styleUrls: ['./select-feature.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class SelectFeatureComponent implements OnInit {
    corporate: any;
    dietitians: any;
    counsellors: any;
    GuidedSettings: any = {};
    AutoSettings: any = {};
    selectedItems: any = [];
    selectedAutoItems: any = [];
    doctors: any;
    guidedProgramme: any[] = [];
    guidedAutoProgramme: any[] = [];
    IsCorporateEdit: boolean = false;
    IsAllAutoJoin: boolean = true;
    doctorName: any = "Select Doctors";
    dietitionName: any = "Select Dietitions";
    counsellorName: any = "Select Counsellors";
    guidedProgrammeName: any = "Select Programme";
    corporateFeaturs = new CorporateFeaturs(0, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, [], [], 0, 0, 0);
    constructor(private corporateService: CorporateService, private errorLog: ErrorLogService, private loadingService: LoadingService) {
    }

    ngOnInit() {
        this.corporate = this.corporateService.getNewCorporate();
        this.IsCorporateEdit = this.corporateService.getCorporateIsEdit();
        setTimeout(() => {
            this.getHealthExperts();
        }, 10);
        setTimeout(() => {
            this.GetCorporateAddonFeature();
        }, 500);
        this.GuidedSettings = {
            singleSelection: false,
            showCheckbox: true,
            text: "Select Programme",
            classes: "multiselect-programme",
            disabled: !this.corporateFeaturs.GuidedPrograms
        };
        this.AutoSettings = {
            singleSelection: false,
            showCheckbox: true,
            text: "Select Programme",
            classes: "multiselect-programme",
            disabled: !this.corporateFeaturs.ProgrameAutoJoin
        };
    }
    ToggleGuidedDisable() {
        this.GuidedSettings = {
            singleSelection: false,
            enableCheckAll: false,
            showCheckbox: true,
            text: "Select Programme",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            classes: "multiselect-programme",
            disabled: !this.corporateFeaturs.GuidedPrograms
        };
        if (!this.corporateFeaturs.GuidedPrograms) {
            this.selectedItems = [];
            this.corporateFeaturs.GuidedProgramme = [];
        }
    }
    ToggleAutoDisable() {
        this.AutoSettings = {
            singleSelection: false,
            enableCheckAll: false,
            showCheckbox: true,
            text: "Select Programme",
            selectAllText: 'Select All',
            unSelectAllText: 'UnSelect All',
            enableSearchFilter: false,
            classes: "multiselect-programme",
            disabled: !this.corporateFeaturs.ProgrameAutoJoin
        };
        if (!this.corporateFeaturs.AutoJoinProgramme) {
            this.selectedAutoItems = [];
            this.corporateFeaturs.AutoJoinProgramme = [];
        }
        else {
            if (this.selectedItems.length > 0)
                this.guidedAutoProgramme = this.selectedItems;
            else
                this.guidedAutoProgramme = this.guidedProgramme;
        }
    }
    getHealthExperts() {
        this.loadingService.showLoader(true);
        this.corporateService.getHealthExperts().subscribe((res: any) => {
            this.dietitians = res.dietitian;
            this.doctors = res.doctor;
            this.counsellors = res.counsellor;
            this.guidedProgramme = res.guidedProgramme;
            this.loadingService.showLoader(false);
        }, error => {
            Utilities.ShowErrorAlert("Oops", Constants.ERROR_MSG, "error");
            this.errorLog.WriteError(Constants.ERROR_MSG, "getHealthExpert").subscribe(res => { }, error => { });
            this.loadingService.showLoader(false);
        });
    }
    setDoctors(UserId: any) {
        for (let doctor of this.doctors) {
            if (doctor.UserID == UserId) {
                this.corporateFeaturs.doctor = UserId;
                this.doctorName = doctor.Name;
                break;
            }
        }
        if (UserId == 0) {
            this.corporateFeaturs.doctor = UserId;
            this.doctorName = "Select Doctors";
        }
    }
    setCounsellors(UserId: any) {
        for (let counsellor of this.counsellors) {
            if (counsellor.UserID == UserId) {
                this.corporateFeaturs.counsellor = UserId;
                this.counsellorName = counsellor.Name;
                break;
            }
        }
        if (UserId == 0) {
            this.corporateFeaturs.counsellor = UserId;
            this.doctorName = "Select Counsellors";
        }
    }
    setDietitians(UserId: any) {
        for (let dietitian of this.dietitians) {
            if (dietitian.UserID == UserId) {
                this.corporateFeaturs.dietitian = UserId;
                this.dietitionName = dietitian.Name;
                break;
            }
        }
        if (UserId == 0) {
            this.corporateFeaturs.dietitian = UserId;
            this.doctorName = "Select Dietitions";
        }
    }
    setProgramms(selectedItem: any) {
        let find: boolean = false;
        let index: number = 0;
        if (this.corporateFeaturs.ProgrameAutoJoin) {
            this.selectedAutoItems = [];
            this.corporateFeaturs.ProgrameAutoJoin = false;
            this.corporateFeaturs.AutoJoinProgramme = [];
            this.ToggleAutoDisable();
        }
        for (let item of this.corporateFeaturs.GuidedProgramme) {
            if (item == selectedItem.id) {
                find = true;
                break;
            }
            index++;
        }
        if (find) {
            this.corporateFeaturs.GuidedProgramme.splice(index, 1);
        }
        else {
            this.corporateFeaturs.GuidedProgramme.push(selectedItem.id);
        }
    }

    setAutoJoinProgramms(selectedItem: any) {
        let find: boolean = false;
        let index: number = 0;
        for (let item of this.corporateFeaturs.AutoJoinProgramme) {
            if (item == selectedItem.id) {
                find = true;
                break;
            }
            index++;
        }
        if (find) {
            this.corporateFeaturs.AutoJoinProgramme.splice(index, 1);
        }
        else {
            this.corporateFeaturs.AutoJoinProgramme.push(selectedItem.id);
        }
    }
    SaveAddonFeature(): void {
        if (this.corporateFeaturs.NutritionistApp && this.corporateFeaturs.dietitian == 0) {
            this.loadingService.showMessage("required", "Please select Telephonic Consultations - Dietitian.", MessageSeverity.info);
            return;
        }
        if (this.corporateFeaturs.CounsellorApp && this.corporateFeaturs.counsellor == 0) {
            this.loadingService.showMessage("required", "Please select Telephonic Consultations - Counsellor.", MessageSeverity.info);
            return;
        }
        if (this.corporateFeaturs.DoctorApp && this.corporateFeaturs.doctor == 0) {
            this.loadingService.showMessage("required", "Please select Telephonic Consultations - Doctor.", MessageSeverity.info);
            return;
        }
        if (this.corporateFeaturs.GuidedPrograms && this.corporateFeaturs.GuidedProgramme.length == 0) {
            this.loadingService.showMessage("required", "Please select atleast one Guided Programme.", MessageSeverity.info);
            return;
        }
        if (this.corporateFeaturs.ProgrameAutoJoin && this.corporateFeaturs.AutoJoinProgramme.length == 0) {
            this.loadingService.showMessage("required", "Please select atleast one programme for auto join.", MessageSeverity.info);
            return;
        }
        this.loadingService.showLoader(true);
        this.corporateService.SaveCorporateAddOnFeature(this.corporateFeaturs).subscribe((res: any) => {
            if (res.status === -1) {
                this.loadingService.showMessage("Oops", Constants.ERROR_MSG, MessageSeverity.error);
                this.loadingService.showLoader(false);
                return false;
            }
            else {
                if (this.IsCorporateEdit) {
                    this.loadingService.showMessage("success", "corporate feature updated.", MessageSeverity.success);
                    this.GoToStep("home");
                }
                else {
                    this.loadingService.showMessage("success", "corporate feature added.", MessageSeverity.success);
                    this.GoToStep("import");
                }
            }
            this.loadingService.showLoader(false);
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "SaveAddonFeature").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "SaveAddonFeature").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    GetCorporateAddonFeature(): void {
        this.loadingService.showLoader(true);
        this.corporateService.getCorporateAddOnFeature(this.corporate.CorporateInfoID | 0).subscribe((res: any) => {
            this.corporateFeaturs = res.result;
            setTimeout(() => {
                if (this.corporateFeaturs.GuidedPrograms) {
                    this.GuidedSettings = {
                        singleSelection: false,
                        showCheckbox: true,
                        text: "Select Programme",
                        classes: "multiselect-programme",
                        disabled: !this.corporateFeaturs.GuidedPrograms
                    };
                    for (let item of this.corporateFeaturs.GuidedProgramme) {
                        this.selectedItems.push(this.guidedProgramme.find((obj) => obj.id == item));
                    }
                }
                if (this.corporateFeaturs.ProgrameAutoJoin) {
                    this.AutoSettings = {
                        singleSelection: false,
                        showCheckbox: true,
                        text: "Select Programme",
                        classes: "multiselect-programme",
                        disabled: !this.corporateFeaturs.ProgrameAutoJoin
                    };
                    if (this.corporateFeaturs.GuidedPrograms) {
                        this.guidedAutoProgramme = this.selectedItems;
                    }
                    else {
                        this.guidedAutoProgramme = this.guidedProgramme;
                    }
                    for (let item of this.corporateFeaturs.AutoJoinProgramme) {
                        this.selectedAutoItems.push(this.guidedAutoProgramme.find((obj) => obj.id == item));
                    }

                }
                this.setDietitians(this.corporateFeaturs.dietitian);
                this.setDoctors(this.corporateFeaturs.doctor);
                this.setCounsellors(this.corporateFeaturs.counsellor);
            }, 500);
            this.loadingService.showLoader(false);
        },
            error => {
                if (Utilities.checkNoNetwork(error)) {
                    this.loadingService.showMessage("Oops", Utilities.noNetworkMessageCaption, MessageSeverity.error);
                    this.errorLog.WriteError(Utilities.noNetworkMessageCaption, "GetCorporateAddonFeature").subscribe(res => { }, error => { });
                }
                else {
                    let errorMessage = Utilities.findHttpResponseMessage("error_description", error, false);
                    this.loadingService.showMessage("Oops", errorMessage || Constants.ERROR_MSG, MessageSeverity.error);
                    this.errorLog.WriteError(errorMessage || Constants.ERROR_MSG, "GetCorporateAddonFeature").subscribe(res => { }, error => { });
                }
                this.loadingService.showLoader(false);
            });
    }
    GoToStep(step: string): void {
        this.corporateService.getStep(step);
    }

}
