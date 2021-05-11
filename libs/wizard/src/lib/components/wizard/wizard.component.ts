import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  OnDestroy,
  ViewEncapsulation,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { Wizard } from '../../wizard.models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pairwise, tap, startWith, map, filter } from 'rxjs/operators';
import { WizardFeatureDirective } from '../../shared/directives/feature.directive';
import { audit, getBaseUrl } from '../../utils';
import { combineLatest } from 'rxjs';
import { WizardStore, wizardStore } from '../../shared/store/wizard.store';
import { Location } from '@angular/common';

@UntilDestroy()
@Component({
  selector: 'nts-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class WizardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form?: FormGroup;
  @Input() sections?: Wizard.Section[];
  @Input() pages?: Wizard.Page[];
  @Input() routes?: Wizard.Route[];
  @Input() validators?: Wizard.PageValidator[];
  @Input() sectionsState?: Wizard.SectionState[];
  @Input() dataFields: Record<string, Wizard.Option[]> = {};
  @Input() models?: unknown[];
  @Input() state?: Wizard.State;
  /** A unique ID for this wizard to keep state separate */
  @Input() wizardId?: string;
  @Input() set settings(settings: Partial<Wizard.Settings>) {
    this.svc.settingsChange(settings);
  }

  /** Holds custom DOM templates passed from parent */
  public templates: Record<string, WizardFeatureDirective> = {};
  @ContentChildren(WizardFeatureDirective)
  set columnTemplates(val: QueryList<WizardFeatureDirective>) {
    const arr = val.toArray();
    if (arr.length) {
      arr.forEach((template) => (this.templates[template.id] = template));
    }
  }

  @Output() ready = new EventEmitter<WizardStore>();
  @Output() routeChanged = new EventEmitter<Wizard.RouteChange>();
  @Output() sectionStateChanged = new EventEmitter<Wizard.SectionState[]>();
  @Output() stateChange = new EventEmitter<Wizard.State>();
  @Output() complete = new EventEmitter<void>();

  public svc = wizardStore(this.router, this.location);

  public state$ = this.svc.state$.pipe(
    // Emit wizard complete action to parent
    tap((state) => {
      this.stateChange.emit(state);
      if (state.complete) {
        this.complete.emit();
        this.svc.stateChange({ complete: false });
      }
    }),
  );

  public settings$ = this.svc.settings$;

  /** Pass section state changes to parent component */
  public sectionsState$ = this.svc.sectionsState$.pipe(
    untilDestroyed(this),
    filter((s) => !!s),
    tap((s) => {
      if (s) {
        this.sectionStateChanged.emit(s);
      }
    }),
  );

  /** Should previous button be visible */
  public previousButtonVisible$ = combineLatest([this.state$, this.svc.sectionsSrc$]).pipe(
    map(([state, sections]) =>
      sections && state.sectionUrl === sections[0].urlSlug && state.routeUrl === sections[0].routeStart ? false : true,
    ),
  );

  public pageActive$ = this.svc.pageActive$.pipe(
    startWith(null),
    pairwise(), // Get previous value
    // Emit current and previous page to parent
    tap((x) =>
      this.routeChanged.emit({
        previous: x && x[0] ? x[0].src : null,
        current: x && x[1] ? x[1].src : null,
        dir: 'next',
      }),
    ), // TODO dir
    map((p) => p[1]),
  );

  private routeParams: Wizard.RouteParams = {};
  private isReady = false;
  private isLoaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
  ) {}

  ngOnInit() {
    console.log('change happened here');
    // Watch route param changes to manage routing changes
    this.route.params.pipe(untilDestroyed(this)).subscribe((params: any) => {
      this.routeParams = { sectionUrl: params.sectionUrl, routeUrl: params.routeUrl };
      if (this.isLoaded) {
        this.svc.routeChange({ sectionUrl: this.routeParams.sectionUrl, routeUrl: this.routeParams.routeUrl });
      }
    });

    // Set wizards unique ID
    if (this.wizardId) {
      this.svc.wizardId = this.wizardId;
    }

    // Watch section state changes
    this.sectionsState$.pipe(untilDestroyed(this)).subscribe();

    this.isReady = true;
    this.readyCheck();
  }

  ngOnChanges() {
    this.readyCheck();
  }

  /**
   * Check if wizard has the required items to initialize
   */
  private readyCheck() {
    if (!this.isLoaded && this.isReady && this.sections && this.pages && this.routes && this.form) {
      if (!this.sections || !this.pages || !this.routes) {
        console.error('Received array for sections, pages and routes but one was empty');
        return;
      }

      // Catch simple mistakes in config
      audit(this.sections, this.pages, this.routes);
      // Send to svc
      this.svc.initialize({
        sections: this.sections,
        pages: this.pages,
        routes: this.routes,
        form: this.form,
        arrayIndexes: this.fb.group({}),
        routeParams: this.routeParams,
        validators: this.validators,
        sectionsState: this.sectionsState,
        baseUrl: getBaseUrl(this.router.url, this.route.snapshot.params),
        state: this.state,
      });
      this.isLoaded = true;
      this.ready.emit(this.svc);
    }
  }

  ngOnDestroy() {}
}
