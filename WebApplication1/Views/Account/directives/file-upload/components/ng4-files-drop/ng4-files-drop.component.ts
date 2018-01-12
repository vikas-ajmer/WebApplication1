import {
    Component,
    DoCheck,
    Input,
    Output,
    EventEmitter,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    HostListener
} from '@angular/core';

import {
    Ng4FilesUtilsService, Ng4FilesService
} from '../../services';

import { Ng4FilesSelected } from '../../declarations';

@Component({
    selector: 'ng4-files-drop', // tslint:disable-line
    templateUrl: './ng4-files-drop.component.html',
    styleUrls: ['./ng4-file-drop.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Ng4FilesDropComponent implements DoCheck {

    @Input() private configId = 'shared';
    @Input()
    UploadImg: string[] = [];
    IsDragEnter: boolean = false;
    acceptExtensions: any = "";
    @Output() filesSelect: EventEmitter<Ng4FilesSelected> = new EventEmitter<Ng4FilesSelected>();

    @HostListener('dragenter', ['$event'])
    public onDragEnter(event: any) {
        this.preventEvent(event);
        this.IsDragEnter = true;
    }

    @HostListener('dragover', ['$event'])
    public onDragOver(event: any) {
        this.preventEvent(event);
        this.IsDragEnter = true;
    }
    @HostListener('dragleave', ['$event'])
    public onDragOut(event: any) {
        this.preventEvent(event);
        this.IsDragEnter = false;
    }

    @HostListener('drop', ['$event'])
    public onDrop(event: any) {
        this.preventEvent(event);

        if (!event.dataTransfer || !event.dataTransfer.files) {
            return;
        }

        this.dropFilesHandler(event.dataTransfer.files);
    }

    constructor(private changeDetector: ChangeDetectorRef,
        private ng4FilesUtilsService: Ng4FilesUtilsService, private ng4FilesService: Ng4FilesService) {
    }

    ngDoCheck() {
        this.changeDetector.detectChanges();
        const config = this.ng4FilesService.getConfig(this.configId);
        this.acceptExtensions = config.acceptExtensions as string;
    }

    private dropFilesHandler(files: FileList) {
        this.filesSelect.emit(
            this.ng4FilesUtilsService.verifyFiles(files, this.configId)
        );
    }

    private preventEvent(event: any): void {
        event.stopPropagation();
        event.preventDefault();
    }

}
