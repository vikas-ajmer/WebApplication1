import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { CorporateService } from '../../../services/corporate.service';
@Component({
    selector: 'add-corporate',
    templateUrl: './add-corporate.component.html',
    styleUrls: [],
    encapsulation: ViewEncapsulation.None
})
export class AddCorporateComponent implements OnInit {
    step: string = "basic";
    basicComplete: boolean = false;
    featureComplete: boolean = false;
    importComplete: boolean = false;
    IsCorporateEdit: boolean = false;
    constructor(private route: ActivatedRoute, private corporateService: CorporateService) {
        let id = this.route.snapshot.paramMap.get('id');
        if (id != null && id != "") {
            corporateService.setCorporateIsEdit(true);
            this.IsCorporateEdit = true;
        }
        else {
            corporateService.setCorporateIsEdit(false);
            this.IsCorporateEdit = false;
        }
        corporateService.notify().subscribe(res => {
            if (res == "feature")
                this.basicComplete = true;
            if (res == "import")
            {
                this.basicComplete = true;
                this.featureComplete = true;
            }
            if (res == "home") {
                this.basicComplete = true;
                this.featureComplete = true;
                this.importComplete = true;
            }
            this.step = res;
        });
    }

    ngOnInit() {
        this.corporateService.setNewCorporate({ Id: 0, TotalMember: 0, Limit: 0 });
    }
}
