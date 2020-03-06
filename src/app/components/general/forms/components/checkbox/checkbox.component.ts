import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
@Component({
  selector: 'nts-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NtsCheckboxComponent implements OnInit, OnChanges {
  @Input() control?: boolean;
  @Input() binary?: boolean;
  @Output() propSelected = new EventEmitter<any>();
  public value: any;

  constructor() { }

  ngOnInit() {
  }

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
