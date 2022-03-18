import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'nts-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class NtsAutocompleteComponent implements OnInit, OnChanges {
  @Input()  value?: any;
  @Input() terms: (string | Record<string, any>)[] | null = [];
  @Input() label?: string;
  @Input() field?: string;
  @Input() placeholder = 'Type to search';
  @Input() control?: FormControl;
  @Input() forceSelection = true;
  @Input() dropdown = true;
  @Input() minLength = 2;
  @Input() dataKey = 'guid';
  @Input() size = 30;
  @Output() termSelected = new EventEmitter<any>();

  public termsFiltered: (string | Record<string, any>)[] = [];

  constructor() {}

  ngOnInit() {}

  ngOnChanges(model: SimpleChanges) {
    // Load default value if one is found in the form control
    if (this.control && this.terms) {
      const termDefault = this.terms.filter((term) => {
        if (!this.control) {
          return false;
        }
        const val: string = this.field ? (<any>term)[this.field] : term;
        return this.control.value === val;
      })[0];
      // Differentiate between string array and object array
      if (this.label && this.field) {
        this.value = { [this.field]: null, [this.label]: this.control.value };
      } else {
        this.value = termDefault ? termDefault : this.control.value;
      }
    }

    // Update filtered terms
    if (model.terms && this.terms) {
      this.termsFiltered = [...this.terms];
    }
  }

  /**
   * Update filter results based on user input
   * @param event
   */
  public filterTerms(event: { originalEvent: MouseEvent; query: string }) {
    if (!this.terms) {
      return;
    }
    this.termsFiltered = this.filterTermsAll(this.terms, event.query);
  }

  /**
   * When a user selects a value from the input
   * @param event
   */
  public onSelect(event: string | Record<string, any>) {
    const value = this.field ? (<any>event)[this.field] : event;
    if (this.control) {
      this.control.patchValue(value);
    }
    this.termSelected.emit(value);
  }

  /**
   * On key up
   * @param event
   */
  public onKeyUp(event: KeyboardEvent) {
    // If enter is presssed, emit value
    if (event.key === 'Enter') {
      if (this.control) {
        this.control.patchValue(this.value);
      }
      this.termSelected.emit(this.value);
    }
  }

  /**
   * When the user de-selects the field via the blur event, pass data to parent or patch form control
   */
  public onBlur() {
    const value = this.field && this.value && this.value[this.field] ? this.value[this.field] : this.value;
    if (this.control) {
      this.control.patchValue(value);
    }
    this.termSelected.emit(value);
  }

  private filterTermsAll(terms: string[] | any[], query: string | null) {
    return terms.filter((term) => {
      const label: string = this.label && term && term[this.label as any] ? term[this.label as any] : term || '';
      return String(label || '')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '')
        .includes(
          String(query || '')
            .toLowerCase()
            .replace(/[^a-z0-9]/gi, ''),
        );
    });
  }
}
