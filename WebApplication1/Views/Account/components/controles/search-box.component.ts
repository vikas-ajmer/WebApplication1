import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'search-box',
    templateUrl: './search-box.component.html',
    styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent {

    @Input()
    placeholder: string = "Search...";

    @Output()
    searchChange = new EventEmitter<string>();

    @Output()
    recoredChange = new EventEmitter<string>();

    @ViewChild("searchInput")
    searchInput: ElementRef;

    @ViewChild("recoredSelect")
    recoredSelect: ElementRef;

    searchTimeout: any;

    onValueChange(value: string) {
        if (this.searchTimeout != undefined || this.searchTimeout == "undefined" || this.searchTimeout != null)
        {
            clearTimeout(this.searchTimeout);
        }
        this.searchTimeout =setTimeout(() => { this.searchChange.emit(value) },500);
    }
    onRecoredSelect(value: string) {
        setTimeout(() => this.recoredChange.emit(value));
    }

    clear() {
        this.searchInput.nativeElement.value = '';
        this.onValueChange(this.searchInput.nativeElement.value);
        setTimeout(() => this.searchChange.emit(''));
    }
}