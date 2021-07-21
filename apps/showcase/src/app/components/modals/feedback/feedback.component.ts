import { Component, ChangeDetectionStrategy } from '@angular/core';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'nts-show-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackModalComponent {
  constructor(public ref: DynamicDialogRef) { }

  /**
   * Submit the form
   */
  public submit() {
    this.ref.close();
  }
}
