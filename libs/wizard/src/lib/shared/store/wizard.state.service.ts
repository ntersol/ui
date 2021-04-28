import { Injectable } from '@angular/core';
import { Wizard } from '../../wizard.models';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { take, map, filter, debounceTime, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup } from '@angular/forms';
import {
  arrayToRecord,
  arrayToTree,
  createActiveFormGroup,
  rulesEngine,
  expressionReplacer,
  routeStart,
  sectionStateCreate,
  sectionStateChange,
  syncActiveModels,
  routeGetNext,
} from '../../utils';
import { sectionControlCreate, routeControlCreate, pageControlCreate } from '../controls';
import { SectionChangeType } from '../../utils/section-state-change.util';

// Constants
// const stateKey = 'wiz-history';
const settingsDefaults: Wizard.Settings = {
  stickyFooter: true,
};

@Injectable({ providedIn: 'root' })
export class WizardStateService {
  private baseUrl?: string;
  // private sections?: Wizard.Section[];
  public sectionsSrc$ = new BehaviorSubject<Wizard.SectionControl[] | null>(null);
  public sections$ = this.sectionsSrc$.pipe(
    map((s) => (!s ? null : arrayToRecord<Wizard.SectionControl>(s, 'urlSlug'))),
  );

  public routesSrc$ = new BehaviorSubject<Wizard.RouteControl[] | null>(null);
  public routes$ = this.routesSrc$.pipe(map((r) => arrayToTree<Wizard.RouteControl>(r, 'sectionId', 'urlSlug')));

  public pagesSrc$ = new BehaviorSubject<Wizard.PageControl[] | null>(null);
  public pages$ = this.pagesSrc$.pipe(map((p) => arrayToTree<Wizard.PageControl>(p, 'sectionId', 'id')));

  private _sectionState: Wizard.SectionState[] | null = null;
  public sectionsState$ = new BehaviorSubject<Wizard.SectionState[] | null>(null);

  public settings$ = new BehaviorSubject<Wizard.Settings>(settingsDefaults);

  public wizardId = 'wiz-history';

  private state: Wizard.State = {
    ready: false,
    sectionUrl: '',
    routeUrl: '',
    routeHistory: [],
    errorTop: false,
    errorBottom: false,
    complete: false,
    sectionState: [],
  };
  private _state$ = new BehaviorSubject<Wizard.State>(this.state);
  public state$ = this._state$.pipe(
    debounceTime(10),
    tap((state) => {
      if (state.ready) {
        localStorage.setItem(this.wizardId, JSON.stringify(state.routeHistory));
      }
    }),
  );

  public sectionActive$ = combineLatest([this.state$, this.sections$]).pipe(
    filter(([state]) => state.ready), // Only return section when ready
    map(([state, sections]) => {
      if (!sections) {
        return null;
      }
      return sections[state.sectionUrl];
    }),
  );
  /** Active page */
  public pageActive$ = combineLatest([this.state$, this.routes$, this.pages$]).pipe(
    filter(([state]) => state.ready), // Only return page when ready
    map(([state, routes, pages]) => {
      if (
        !routes ||
        !pages ||
        !state.sectionUrl ||
        !state.routeUrl ||
        !routes[state.sectionUrl] ||
        !routes[state.sectionUrl][state.routeUrl]
      ) {
        return null;
      }
      const pageId = routes[state.sectionUrl][state.routeUrl].pageId;
      return pages[state.sectionUrl][pageId];
    }),
  );

  private rulesEngine?: Wizard.RulesEngine;
  /** Main Formgroup reference */
  private formGroup?: FormGroup;
  /** Holds an active model from within an array */
  private formGroupActive?: FormGroup;

  constructor(private router: Router, public location: Location) {}

  /**
   * Kick things off
   */
  public initialize({
    sections,
    pages,
    routes,
    form,
    arrayIndexes,
    routeParams,
    baseUrl,
    validators,
    sectionsState,
  }: Wizard.Initial) {
    // console.log('initialize');
    this.baseUrl = baseUrl;
    this.formGroup = form;
    // Create initial formgroup for active models
    const formGroupActive = createActiveFormGroup(form);
    this.formGroupActive = formGroupActive;
    // Curry rules engine with refs to form and indexes
    const rulesEngineSrc = rulesEngine(form, arrayIndexes);
    this.rulesEngine = rulesEngineSrc;
    const expressionReplacerSrc = expressionReplacer(form, arrayIndexes);

    const validatorRecord: Record<string, Wizard.PageValidatorFn> = {};
    if (validators && validators.length) {
      validators.forEach((v) => (validatorRecord[v.id] = v.fn));
    }

    // Create controls
    this.sectionsSrc$.next(
      sections.map((s, i) => {
        const routeCounts = routes.reduce((a, route) => (route.sectionId === s.urlSlug ? a + 1 : a), 0);
        return sectionControlCreate(s, i, expressionReplacerSrc, routeCounts);
      }),
    );
    this.routesSrc$.next(routes.map((r) => routeControlCreate(r)));
    this.pagesSrc$.next(
      pages.map((p) =>
        pageControlCreate(
          p,
          rulesEngineSrc,
          expressionReplacerSrc,
          form,
          formGroupActive,
          p.validatorId ? validatorRecord[p.validatorId] : null,
        ),
      ),
    );

    // Get starting route params
    const params = routeStart(routeParams, sections);
    // Get route history from local storage
    const history: string[] = JSON.parse(localStorage.getItem(this.wizardId) || `[]`) || [];
    // If history is blank add first route in section
    if (!history.length && params.routeUrl) {
      history.push(params.routeUrl);
    }

    // If section state not supplied, generate the initial one
    if (!sectionsState) {
      this._sectionState = sectionStateCreate(sections);
      this.sectionStateChange('initial', params.sectionUrl);
    } else {
      // TODO: Rehydrate section state
      // this._sectionState = [...sectionsState];
      // this.sectionStateChange('sectionChange', );
    }

    this.router.navigate([`${this.baseUrl}/${params.sectionUrl}/${params.routeUrl}`]);
    this.stateChange({ ready: true, sectionUrl: params.sectionUrl, routeUrl: params.routeUrl, routeHistory: history });

    /**
    console.log(this.formGroup.value);
    console.log(this.formGroupActive.value);
    this.pageActive$.subscribe(p => console.log('Page Active', p));
    this.routes$.subscribe(p => console.log('Routes', p));
    this.state$.subscribe(p => console.log('State', p.routeHistory));
    this.sectionsSrc$.subscribe(p => console.log('Sections', p));
     this.sectionsState$.subscribe(p => console.log('sectionsState', p));
    this.settings$.subscribe(p => console.log('settings', p));
    */
  }

  /**
   * Change wizard settings
   * @param settings
   */
  public settingsChange(settings: Partial<Wizard.Settings>) {
    this.settings$.next({
      // Defaults
      ...settingsDefaults,
      // Overrides
      ...settings,
    });
  }

  /**
   *
   * @param state
   */
  public stateChange(state: Partial<Wizard.State>) {
    this.state = { ...this.state, ...state };
    this._state$.next(this.state);
  }

  /**
   *
   * @param action
   */
  public sectionStateChange(action: SectionChangeType, sectionNext?: string) {
    // console.log('sectionStateChange', action, sectionNext);
    if (!this._sectionState) {
      return;
    }

    this._sectionState = sectionStateChange(this._sectionState, action, sectionNext, this.state.routeHistory);
    this.sectionsState$.next(this._sectionState);
  }

  /**
   * Go to a specific route
   * @param param0
   */
  public routeChange(routeParams: Partial<Wizard.RouteParams>) {
    // console.log('routeChange', routeParams, { ...this.state });

    let sectionUrl = routeParams.sectionUrl;
    let routeUrl = routeParams.routeUrl;

    // Get starting route params
    if (!routeParams.sectionUrl || !routeParams.routeUrl) {
      combineLatest([this.sectionsSrc$, this.sectionsState$])
        .pipe(take(1))
        .subscribe(([s, sectionsState]) => {
          if (!routeParams.sectionUrl && s) {
            sectionUrl = s[0].urlSlug;
          }
          if (!routeParams.routeUrl && s) {
            // Check for section history
            const matchingState = (sectionsState || []).filter(
              (state) => state.sectionId === routeParams.sectionUrl,
            )[0];
            if (matchingState && matchingState.routeHistory && matchingState.routeHistory.length) {
              routeUrl = matchingState.routeHistory[matchingState.routeHistory.length - 1];
              this.stateChange({ routeHistory: matchingState.routeHistory });
            } else {
              // else use first section in route
              const sectionCurrent = s.filter((s2) => s2.urlSlug === routeParams.sectionUrl)[0];
              routeUrl = sectionCurrent.routeStart;
              this.stateChange({ routeHistory: [routeUrl] });
            }
          }
        });
    }

    // Update section statuses
    if (sectionUrl !== this.state.sectionUrl) {
      this.sectionStateChange('sectionChange', sectionUrl);
    }

    if (routeUrl !== this.state.routeUrl) {
      this.sectionStateChange('routeChange', sectionUrl);
    }

    // If any changes in the active formgroup, patch back to main model
    if (this.formGroup && this.formGroupActive && this.formGroupActive.dirty) {
      syncActiveModels(this.formGroup, this.formGroupActive);
    }

    this.router.navigate([`${this.baseUrl}/${sectionUrl}/${routeUrl}`]);

    this.stateChange({ sectionUrl: sectionUrl, routeUrl: routeUrl || '' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Calculate next route
   */
  public routeNext() {
    // console.log('routeNext');
    combineLatest([this.state$, this.routes$, this.sections$, this.pageActive$])
      .pipe(take(1))
      .subscribe(([state, routes, sections, pageActive]) => {
        if (!state || !routes || !sections || !this.rulesEngine || !pageActive) {
          return;
        }

        // Mark page controls as touched to set validation states
        pageActive.controlsMarkAsTouched();
        pageActive.pageTouched = true;
        // If page is not valid, scroll to top & stop routing
        if (!pageActive.valid) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }
        // Get next route action
        const routeAction = routeGetNext(state, routes, sections, this.rulesEngine);
        if (routeAction && routeAction.event === 'wizardComplete') {
          this.stateChange({ complete: true });
          return;
        }

        // If a route action is supplied and thi shas all params
        if (routeAction && routeAction.routeParams && routeAction.routeParams.routeUrl) {
          // Update route history
          let routeHistory = [...this.state.routeHistory, routeAction.routeParams.routeUrl];
          // Determine what to do next
          switch (routeAction.event) {
            case 'sectionComplete':
              routeHistory = [routeAction.routeParams.routeUrl];
              this.sectionStateChange('sectionComplete', routeAction.routeParams.sectionUrl);
              break;
          }
          // Update history and error states
          this.stateChange({ routeHistory: routeHistory, errorTop: false, errorBottom: false });
          // Reset page control state
          pageActive.controlsMarkAsUntouched();
          pageActive.pageTouched = false;

          this.router.navigate([
            `${this.baseUrl}/${routeAction.routeParams.sectionUrl}/${routeAction.routeParams.routeUrl}`,
          ]);
        }
      });
  }

  /**
   * Calculate previous route
   * TODO: Move to reducer
   */
  public routePrevious() {
    // console.log('routePrevious', this.state.routeHistory);
    // Go back in current state
    if (this.state.routeHistory.length > 1) {
      const history = [...this.state.routeHistory];
      history.length = history.length - 1;
      const routeUrl = history[history.length - 1];
      this.stateChange({ routeHistory: history, routeUrl: history[history.length - 1] });
      this.sectionStateChange('routePrev');
      this.router.navigate([`${this.baseUrl}/${this.state.sectionUrl}/${routeUrl}`]);
    } else if (this.state.routeHistory.length === 1 && this._sectionState) {
      // Going to previous section
      for (let i = 0; i < this._sectionState.length; i++) {
        if (this.state.sectionUrl === this._sectionState[i].sectionId) {
          const sectionPrev = this._sectionState[i - 1];
          let routeUrl =
            sectionPrev.routeHistory[sectionPrev.routeHistory.length - 1] ||
            sectionPrev.routeHistory[sectionPrev.routeHistory.length - 0];
          if (!routeUrl) {
            routeUrl = sectionPrev.routeStart;
          }

          this.stateChange({
            sectionUrl: sectionPrev.sectionId,
            routeHistory: sectionPrev.routeHistory,
            routeUrl: routeUrl,
          });
          this.sectionStateChange('sectionChange', sectionPrev.sectionId);
          this.router.navigate([`${this.baseUrl}/${sectionPrev.sectionId}/${routeUrl}`]);
          break;
        }
      }
    }
  }
}
