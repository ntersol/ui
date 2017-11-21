import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
/**
 * <file-upload #fileUpload [frmGroup]="formMain" frmControl="files" label="Upload Files" [multiple]="true" [dragNdrop]="true" (filesAdded)="filesAdded($event)"></file-upload>
 */
@Component({
    selector: 'file-upload',
    templateUrl: './file-upload.component.html'
})
export class FileUploadComponent implements OnInit {

    @Input() frmGroup: FormGroup;
    @Input() frmControl: string; // Object property of reactive form
    @Input() label: string; // Label for the user to read
    @Input() classes: string = ''; // Placeholder property
    @Input() disabled: boolean = false; // Disabled or not
    @Input() multiple: boolean = false; // Upload multiple files or not
    @Input() dragNdrop: boolean  = false; // Show drag and drop box instead of file upload

    @Output() filesAdded: EventEmitter<any> = new EventEmitter();

    public field: AbstractControl; // Hold a reference to the current field element, this is set in ngoninit
    public files: any; // Formdata object for files
    public hover: boolean = false;

    constructor() {}

    ngOnInit() {
        this.field = this.frmGroup.get(this.frmControl); //Set a reference to this field for simplicity
    }

    /**
     * When files are added
     * @param event
     */
    public onFilesAdded(event: any) {
        this.files = event.srcElement.files;
        let formData: FormData = new FormData();

        for (let i = 0; i < this.files.length; i++) {
            formData.append('files[]', this.files[i], this.files[i].name);
        }
		this.filesAdded.emit({ formData: formData, event: event });
    }

    public updateHover(newState: boolean) {
        this.hover = newState;
    }

    /**
     * Remove files from the upload box
     */
    public deleteFiles() {
        this.hover = false;
        this.files = null;
    }

    ngOnDestroy() {
      
    }

}
