import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NtsWizard } from '../../..';
import { WizardStore } from '../../../shared/store/wizard.store';

@Component({
  selector: 'nts-wizard-nav-sidebar',
  templateUrl: './nav-sidebar.component.html',
  styleUrls: ['./nav-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WizNavSidebarComponent implements OnInit {
  @Input() store: WizardStore | null = null;

  public selector = this.fb.group({
    active: [null, []],
  });

  public active = this.selector.get('active') as FormControl;

  public sectionsState$: Observable<NtsWizard.SectionState[] | null> | null = null;
  public activeSectionNumber$: Observable<number | null> | null = null;
  public sectionsSelector$: Observable<
    {
      label: string;
      value: string;
    }[]
  > | null = null;

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
      tap(sections => {
        const sectionActive = sections?.filter(s => s.active)[0];
        const active = this.selector.get('active');
        if (sectionActive && active) {
          active.patchValue(sectionActive.sectionId);
        }
      }),
    );
    // Get active section
    this.activeSectionNumber$ = this.sectionsState$.pipe(
      map(sections => {
        if (sections && sections.length) {
          return sections.findIndex(section => section.active) + 1;
        }
        return null;
      }),
    );
    //
    this.sectionsSelector$ = this.store.sectionsSrc$.pipe(
      map(sections => (sections ? sections.map(s => Object.assign({}, { label: s.title, value: s.urlSlug })) : [])),
    );
  }
}
