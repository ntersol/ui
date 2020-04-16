import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ioToForm } from '@nll/ngx';

@Component({
  selector: 'nts-notes',
  template: `
    <p-panel header="Notes">
      <section class="fld-col flg-4">
        <form [formGroup]="form" class="fld-col flg-4">
          <textarea pInputTextarea formControlName="note" required class="rs-v"></textarea>

          <button pButton icon="pi pi-save" label="Add New Note" (click)="addNewNote.emit(form.value)"></button>
        </form>

        <ul class="fld-col flg-3">
          <li *ngFor="let note of notes; let even = even" [class.ct-b1]="even" class="pwx-4 pwy-3 bra-2 fld-col flg-3">
            <span>{{ note.note }}</span>
            <small class="fld-row flg-2 ai-ctr as-end">
              <!-- Pixel Perfect Padding -->
              <span class="pwb-1">{{ note.inserted | date: 'short' }}</span>
              <i class="pi pi-clock"></i>
            </small>
          </li>
          <li *ngIf="notes.length === 0">No Notes!</li>
        </ul>
      </section>
    </p-panel>
  `,
  styles: [
    `
      .rs-v {
        resize: vertical;
      }
    `,
  ],
})
export class NotesComponent {
  @Input()
  notes: NtsScripter.CallNote[] = [];
  @Output()
  addNewNote = new EventEmitter<NtsScripter.CallNote>();

  readonly form = ioToForm(NtsScripter.CallNote) as FormGroup;

  handleChange() {}

  constructor() {}
}
