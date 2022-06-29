import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
@Component({
  selector: 'nts-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NtsCheckboxComponent implements OnChanges {
  @Input() control?: boolean;
  @Input() label = '';
  @Input() binary = true;
  @Output() propSelected = new EventEmitter<boolean>();
  public value: any;

  ngOnChanges() {
    // Load default value if one is found in the form control
    if (this.control) {
      this.value = this.control;
    }
  }

  /**
   * When a user checks a value from the checkbox
   * @param event
   */
  public onSelect(event: boolean) {
    this.propSelected.emit(event);
  }
}
