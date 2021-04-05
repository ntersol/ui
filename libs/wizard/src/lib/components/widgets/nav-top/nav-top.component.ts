import { Component, OnInit, ChangeDetectionStrategy, ViewEncapsulation, Input, OnChanges } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { WizardStore } from '../../../shared/store/wizard.store';
import { Wizard } from '../../../wizard';

@Component({
  selector: 'nts-wizard-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class WizNavTopComponent implements OnInit, OnChanges {
  @Input() store?: WizardStore;

  public selector = this.fb.group({
    active: [null, []],
  });

  public sectionsState$?: Observable<Wizard.SectionState[] | null>;
  public activeSectionNumber$?: Observable<number | null>;
  public sectionsSelector$?: Observable<
    {
      label: string;
      value: string;
    }[]
  >;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  ngOnChanges() {
    this.initialize();
  }

  /**
   * Initialize the top nav
   * The store may not be loaded before this instantiates
   */
  public initialize() {
    if (!this.store) {
      return;
    }
    // Set up sectionState
    this.sectionsState$ = this.store.sectionsState$.pipe(
      tap((sections) => {
        const sectionActive = sections?.filter((s) => s.active)[0];
        const active = this.selector.get('active');
        if (sectionActive && active) {
          active.patchValue(sectionActive.sectionId);
        }
      }),
    );
    // Get active section
    this.activeSectionNumber$ = this.sectionsState$.pipe(
      map((sections) => {
        if (sections && sections.length) {
          return sections.findIndex((section) => section.active) + 1;
        }
        return null;
      }),
    );
    //
    this.sectionsSelector$ = this.store.sectionsSrc$.pipe(
      map((sections) => (sections ? sections.map((s) => Object.assign({}, { label: s.title, value: s.urlSlug })) : [])),
    );
  }
}
