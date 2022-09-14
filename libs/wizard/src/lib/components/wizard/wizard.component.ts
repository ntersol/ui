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
  SimpleChanges,
} from '@angular/core';
import { NavigationStart } from '@angular/router';
import { NtsWizard } from '../../wizard.models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { pairwise, tap, startWith, map, filter, take, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { WizardFeatureDirective } from '../../shared/directives/feature.directive';
import { audit, getBaseUrl } from '../../utils';
import { combineLatest, Subscription } from 'rxjs';
import { WizardStore, wizardStore } from '../../shared/store/wizard.store';
import { Location } from '@angular/common';
import { isType } from '../../utils/typeguards.util';
import { Title } from '@angular/platform-browser';

/**
 * A dynamic model driven wizard
 * @todo
 * - Refactor all page level validation handling, currently its a big mess
 * - Switch to new form package
 * - Switch to new validator system for form controls
 * - Switch to classes for control generation
 * - A validator that requires a truthy statement to pass validation checks. IE "I consent" checkbox
 */
@UntilDestroy()
@Component({
  selector: 'nts-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // tslint:disable-next-line:use-component-view-encapsulation
  encapsulation: ViewEncapsulation.None,
})
export class NtsWizardComponent implements OnInit, OnChanges, OnDestroy {
  @Input() form?: FormGroup | null = null;
  @Input() sections?: NtsWizard.Section[] | null = null;
  @Input() pages?: NtsWizard.Page[] | null = null;
  @Input() routes?: NtsWizard.Route[] | null = null;
  @Input() validators?: NtsWizard.ValidatorCustom[] | null = null;
  @Input() sectionsState?: NtsWizard.SectionState[] | null = null;
  /** Dynamic data supplied to dropdowns from outside the wizard */
  @Input() dataFields?: Record<string, NtsWizard.Option[]> | null = null;
  /** Replace static properties with dynamic data */
  @Input() variableReplacement?: NtsWizard.VariableReplacement[] | null = null;
  @Input() models?: unknown[] | null = null;
  @Input() state?: NtsWizard.State | null = null;
  /** A unique ID for this wizard to keep state separate */
  @Input() wizardId: string | null = null;
  @Input() set settings(settings: Partial<NtsWizard.Settings>) {
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
  @Output() routeChanged = new EventEmitter<NtsWizard.RouteChange>();
  @Output() sectionStateChanged = new EventEmitter<NtsWizard.SectionState[]>();
  @Output() stateChanged = new EventEmitter<NtsWizard.State>();
  /** When the wizard has completed the last page of the last section and is complete */
  @Output() completed = new EventEmitter<void>();
  @Output() actionPerformed = new EventEmitter<NtsWizard.Action>();
  /** Store/state management */
  public svc = wizardStore(this.router, this.location);

  /** When wizard is loaded and ready */
  public ready$ = this.svc.state$.pipe(
    map((s) => s.ready),
    distinctUntilChanged(),
    debounceTime(100), // Add slight debounce to initial load to ensure everything is loaded
  );

  public settings$ = this.svc.settings$;

  /** Pass section state changes to parent component */
  public sectionsState$ = this.svc.sectionsState$.pipe(
    debounceTime(1),
    filter((s) => !!s),
  );

  /** Should previous button be visible */
  public previousButtonVisible$ = combineLatest([this.svc.state$, this.svc.sectionsSrc$]).pipe(
    map(([state, sections]) =>
      sections && state.sectionUrl === sections[0].urlSlug && state.routeUrl === sections[0].routeStart ? false : true,
    ),
  );

  /** Active page */
  public pageActive$ = this.svc.pageActive$;

  public nextWaiting$ = this.svc.state$.pipe(
    map((s) => s.status.nextWaiting),
    distinctUntilChanged(),
  );

  private routeParams: NtsWizard.RouteParams = { sectionUrl: '', routeUrl: '' };
  private isReady = false;
  private isLoaded = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private location: Location,
    private title: Title,
  ) {}

  ngOnInit() {
    // Emit state changes to parent
    this.svc.state$.pipe(debounceTime(100), untilDestroyed(this)).subscribe((state) => {
      this.stateChanged.emit(state);
      if (state.complete) {
        this.completed.emit();
        this.svc.stateChange({ complete: false });
      }
    });

    // Change page title based on active page
    combineLatest([this.pageActive$, this.svc.settings$])
      .pipe(untilDestroyed(this))
      .subscribe(([p, settings]) => {
        // Check if title tag is supplied, if not default to page title
        let title = p?.titleTag ?? p?.title;
        // Only update title tag if either title supplied
        if (!!title) {
          // If append/prepend slugs are provided in settings, attach those
          title = !!settings?.pageTitle?.prepend ? settings?.pageTitle?.prepend + title : title;
          title = !!settings?.pageTitle?.append ? title + settings?.pageTitle?.append : title;
          this.title.setTitle(title);
        }
      });

    combineLatest([
      // Route params used by wizard
      this.route.params,
      // Check for restoredState prop, this is when the user uses the forward/back button in the browser
      this.router.events.pipe(
        filter((event) => event instanceof NavigationStart),
        map((e) => !!(e as NavigationStart)?.restoredState?.navigationId),
      ),
    ])
      .pipe(untilDestroyed(this), debounceTime(1))
      .subscribe(([params, isBrowserButton]) => {
        this.routeParams = { sectionUrl: params.sectionUrl, routeUrl: params.routeUrl };
        if (this.isLoaded) {
          this.svc.routeChange(
            { sectionUrl: this.routeParams.sectionUrl, routeUrl: this.routeParams.routeUrl },
            isBrowserButton,
          );
        }
      });

    // Watch active page changes, manage any beforeLoad actions
    this.pageActive$
      .pipe(
        untilDestroyed(this),
        filter((page) => !!page?.actions?.beforeLoad),
      )
      .subscribe((page) => this.svc.actions(page?.actions?.beforeLoad));

    // Pass actions to the parent component
    this.svc.actions$.pipe(untilDestroyed(this)).subscribe((a) => this.actionPerformed.emit(a));

    // Emit route changes to parent component
    combineLatest([
      // Get active page
      this.svc.pageActive$.pipe(
        startWith(null),
        pairwise(), // Get previous value, IE current and previous page
        map(
          (x) =>
            ({
              previous: x && x[0] ? x[0] : null,
              current: x && x[1] ? x[1] : null,
            } as NtsWizard.RouteChange),
        ),
      ),
      this.svc.routeDir$.pipe(startWith('initial' as NtsWizard.RouteDirection)),
    ])
      .pipe(debounceTime(10), untilDestroyed(this))
      .subscribe((r) => this.routeChanged.emit({ ...r[0], dir: r[1] }));

    // Watch section state changes
    this.sectionsState$.pipe(untilDestroyed(this)).subscribe((s) => (s ? this.sectionStateChanged.emit(s) : null));

    this.isReady = true;
    this.readyCheck();

    // Handle change detection logic for simple routes
    let sub: Subscription | null = null;
    // When the active page changes
    this.pageActive$.pipe(untilDestroyed(this)).subscribe((p) => {
      // If a sub is existing when page changes. This is to catch scenarios where routing occurs without this method
      if (sub) {
        sub.unsubscribe();
      }
      // If this page has the simpleRoute flag checked and has content
      if (p?.simpleRoute && p?.content?.length) {
        // Get all the form fields associated with this page
        const formFields = p?.content.filter(isType.formFieldControl).map((c) => c.formControl.valueChanges);
        // When any of the formfield's data changes
        sub = combineLatest([...formFields])
          .pipe(take(1))
          .subscribe(() => {
            // Clean up sub, a bit redundant with take 1
            if (sub) {
              sub.unsubscribe();
            }
            // Go to next route
            this.svc.routeNext();
          });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    // Check if loaded
    if (!this.isLoaded) {
      this.readyCheck();
    }

    // Set wizards unique ID
    if (changes.wizardId && this.wizardId) {
      this.svc.wizardId = this.wizardId;
    }
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
        variables: this.variableReplacement || null,
      });
      this.isLoaded = true;
      this.ready.emit(this.svc);
    }
  }

  /**
   * Handle actions from button events
   * @param button
   */
  public buttonEvent(button: NtsWizard.Button) {
    this.svc.actions(button.actions);
  }

  ngOnDestroy() {}
}
