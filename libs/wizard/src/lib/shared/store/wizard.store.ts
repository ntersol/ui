import { NtsWizard } from '../../wizard.models';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { take, map, filter, debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { arrayToRecord, arrayToTree, routeStart, sectionStateCreate, sectionStateChange, routeGetNext } from '../../utils';
import { sectionControlCreate, routeControlCreate, pageControlCreate } from '../controls';
import { getFormControlPath } from '../../utils/form-management/get-form-control.util';
import { arrayDeleteItem, arrayUpsertItem, copyItem, createItem } from '../../utils/form-management/create-or-update-formgroup.util';
import { isType } from '../../utils/typeguards.util';
import { generateFormControlTree, stringToFormControl } from '../../utils/get-content.util';
import { isValid } from '../../utils/form-management/is-valid.util';
import { sectionStateActions } from '../../utils/actions/section-state.actions';
import { variableReplacement } from '../../utils/variable-replacement.util';

// Constants
const settingsDefaults: NtsWizard.Settings = {
  stickyFooter: true,
};

export class WizardStore {
  private baseUrl?: string;

  public sectionsSrc$ = new BehaviorSubject<NtsWizard.SectionControl[] | null>(null);
  public sections$ = this.sectionsSrc$.pipe(map(s => (!s ? null : arrayToRecord<NtsWizard.SectionControl>(s, 'urlSlug'))));

  public routesSrc$ = new BehaviorSubject<NtsWizard.RouteControl[] | null>(null);
  public routes$ = this.routesSrc$.pipe(map(r => arrayToTree<NtsWizard.RouteControl>(r, 'sectionId', 'urlSlug')));

  public pagesSrc$ = new BehaviorSubject<NtsWizard.PageControl[] | null>(null);
  public pages$ = this.pagesSrc$.pipe(map(p => arrayToTree<NtsWizard.PageControl>(p, 'sectionId', 'id')));

  private _sectionState: NtsWizard.SectionState[] | null = null;
  public sectionsState$ = new BehaviorSubject<NtsWizard.SectionState[] | null>(null);

  public settings$ = new BehaviorSubject<NtsWizard.Settings>(settingsDefaults);
  public actions$ = new Subject<NtsWizard.Action>();
  public cd$ = new BehaviorSubject(Math.random());

  public wizardId: string | null = null;

  public validators?: NtsWizard.ValidatorCustom[] | null = null;

  private state: NtsWizard.State = {
    ready: false,
    sectionUrl: '',
    routeUrl: '',
    routeHistory: [],
    errorTop: false,
    errorBottom: false,
    complete: false,
    sectionState: [],
    routeDir: null,
    status: {
      ready: false,
      complete: false,
      nextWaiting: false,
    },
  };
  private _state$ = new BehaviorSubject<NtsWizard.State>(this.state);
  public state$ = this._state$.pipe(
    debounceTime(10),
    distinctUntilChanged(),
    tap(state => {
      if (state.ready && this.wizardId) {
        localStorage.setItem(this.wizardId, JSON.stringify(state));
      }
    }),
  );

  /** Direction of last route change */
  // public routeDir$ = this.state$.pipe(map(state => state.routeDir));
  public routeDir$ = new Subject<NtsWizard.RouteDirection>();

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
    debounceTime(1),
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
    distinctUntilChanged((a, b) => !!a && !!b && a.sectionId === b.sectionId && a.id === b.id),
    tap(p => p?.errorChange(null)), // Reset page errors on every change
  );

  /** Main Formgroup reference */
  private formGroup?: FormGroup;

  private formControls: Record<string, NtsWizard.PageControl> = {};

  constructor(private router: Router, public location: Location) {}

  /**
   * Kick things off
   */
  public initialize({
    sections,
    pages,
    routes,
    form,
    routeParams,
    baseUrl,
    validators,
    sectionsState,
    state,
    variables,
  }: NtsWizard.Initial) {
    this.baseUrl = baseUrl;
    this.formGroup = form;
    this.validators = validators;

    let sectionsMapped = !!variables ? variableReplacement(sections, variables) : sections;
    let pagesMapped = !!variables ? variableReplacement(pages, variables) : pages;

    // Create controls
    this.sectionsSrc$.next(
      sectionsMapped.map((s, i) => {
        const routeCounts = routes.reduce((a, route) => (route.sectionId === s.urlSlug ? a + 1 : a), 0);
        return sectionControlCreate(s, i, this.formGroup || form, routeCounts);
      }),
    );
    // Generate route controls
    this.routesSrc$.next(routes.map(r => routeControlCreate(r)));
    // Generate page controls
    const pageControls = pagesMapped.map(p => pageControlCreate(p, form, validators));
    this.pagesSrc$.next(pageControls);
    // Generate tree of form controls
    this.formControls = generateFormControlTree(pageControls);

    let localState = state;
    if (!localState && this.wizardId) {
      // Get current state from localstorage
      localState = JSON.parse(localStorage.getItem(this.wizardId) || `{}`) || {};
    }

    // Get starting route params
    const params = routeStart(routeParams, sectionsMapped);
    // Get route history from local storage
    const history: NtsWizard.RouteParams[] = localState?.routeHistory || [];
    // If history is blank add first route in section
    if (!history.length && params.routeUrl) {
      history.push(params);
    }

    // Check if section state is present in localstorage
    if (localState?.sectionState?.length) {
      this.sectionStateChange(sectionStateActions.reload(localState.sectionState));
      // If section state not supplied, generate the initial one
    } else if (!sectionsState) {
      this.sectionStateChange(
        sectionStateActions.initial({
          sectionStart: params.sectionUrl,
          sectionState: sectionStateCreate(sections),
        }),
      );
    } else {
      // TODO: Rehydrate section state
    }
    const sectionId = !!state?.sectionUrl ? state.sectionUrl : params.sectionUrl;
    const routeUrl = !!state?.routeUrl ? state.routeUrl : params.routeUrl;
    this.router.navigate([`${this.baseUrl}/${sectionId}/${routeUrl}`], { queryParamsHandling: 'merge' });

    this.stateChange({ ready: true, sectionUrl: sectionId, routeUrl: routeUrl, routeHistory: history });
  }

  /**
   * Change wizard settings
   * @param settings
   */
  public settingsChange(settings: Partial<NtsWizard.Settings>) {
    this.settings$.next({
      // Defaults
      ...settingsDefaults,
      // Overrides
      ...settings,
    });
  }

  /**
   * Change state of wizard
   * @param state
   */
  public stateChange(state: Partial<NtsWizard.State> | Partial<{ status: Partial<NtsWizard.Status> }>) {
    const status = !!state.status ? { ...this.state.status, ...state.status } : this.state.status;
    this.state = { ...this.state, ...state, status: status };
    this._state$.next(this.state);
  }

  /**
   *
   * @param action
   */
  public sectionStateChange(action: NtsWizard.StateAction) {
    combineLatest([this.sectionsState$, this.state$])
      .pipe(take(1))
      .subscribe(([sectionsState, state]) => {
        this._sectionState = sectionStateChange(sectionsState || [], state, action);
        this.stateChange({ sectionState: this._sectionState });
        this.sectionsState$.next(this._sectionState);
      });
  }

  /**
   * Refresh the current view without a route change.
   * Useful for triggering change detection
   */
  public refresh() {
    this.cd$.next(Math.random());
  }

  /**
   * Manage route changes received from the url
   * @param routeParams
   */
  public routeChange(routeParams: Partial<NtsWizard.RouteParams>, isBrowserButton: boolean) {
    // console.log('routeChange', routeParams, isBrowserButton);
    let sectionUrl = routeParams.sectionUrl;
    let routeUrl = routeParams.routeUrl;

    // If this is a brower button event
    if (isBrowserButton) {
      this.sectionStateChange(sectionStateActions.browserButton(routeParams));
    }
    // Update section statuses
    else if (!!sectionUrl && sectionUrl !== this.state.sectionUrl) {
      this.sectionStateChange(sectionStateActions.sectionChange(sectionUrl));
    }

    /** */
    // Manage route history
    // Clone route history array
    let history = [...this.state.routeHistory];
    // Get the second to last item in the history
    let last: NtsWizard.RouteParams | null = null;
    if (history.length >= 2) {
      last = history[history.length - 2];
    }
    // Get
    let current: NtsWizard.RouteParams | null = null;
    if (history.length >= 1) {
      current = history[history.length - 1];
    }

    // If the new page matches the current page then this is a refresh action
    // Prevent duplicate pages from being added to the route history array
    if (!!current && sectionUrl === current.sectionUrl && routeUrl === current.routeUrl) {
      // Do nothing, prob a better way to handle this condition
    } else if (!!last && sectionUrl === last.sectionUrl && routeUrl === last.routeUrl) {
      // Remove last entry
      history.length = history.length - 1;
    } else {
      // Otherwise this is a next action, add entry to array
      history = [...this.state.routeHistory, { sectionUrl: sectionUrl || '', routeUrl: routeUrl || '' }];
    }

    // Update state
    this.stateChange({ sectionUrl: sectionUrl, routeUrl: routeUrl || '', routeHistory: history });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Go to a specific route
   * @param routeParams
   */
  public routeGoTo(routeParams?: Partial<NtsWizard.RouteParams>) {
    if (!routeParams) {
      return;
    }
    // Get section controls
    this.sectionsSrc$
      .pipe(
        take(1),
        map(s => s?.map(s2 => s2?.src) || []), // Map to sections src
      )
      .subscribe(sections => {
        const params = routeStart(routeParams, sections);
        this.router.navigate([`${this.baseUrl}/${params.sectionUrl}/${params.routeUrl}`], { queryParamsHandling: 'merge' });
      });
  }

  /**
   * Calculate next route
   */
  public routeNext() {
    combineLatest([this.state$, this.routes$, this.sections$, this.pageActive$])
      .pipe(take(1))
      .subscribe(([state, routes, sections, pageActive]) => {
        if (!state || !routes || !sections || !pageActive || !this.formGroup) {
          return;
        }

        // Mark page controls as touched to set validation states
        pageActive.controlsMarkAsTouched();
        pageActive.pageTouched = true;

        // If page is not valid, add default error message
        if (!pageActive.valid) {
          pageActive.errorChange('Please fix the issues below');
        }

        // Check for required fields that fail the validation check, display custom error message
        if (!pageActive.validRequiredFields && pageActive?.requiredFields?.length) {
          const errorMsg = pageActive?.requiredFields.map(x => x.errorMesage + '<br/>').reduce((a, b) => a + b);
          pageActive.errorChange(errorMsg);
        }

        // If page is not valid, scroll to top & stop routing
        if (!pageActive.valid) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          return;
        }

        // Post valid route logic. Stored in a closure to support async and async actions
        const routeNext = () => {
          if (!state || !routes || !sections || !pageActive || !this.formGroup) {
            return;
          }

          // If this page has some afterNext actions. Must go after validation
          if (pageActive?.actions?.afterNext) {
            this.actions(pageActive?.actions?.afterNext);
          }

          // Get next route action
          const routeAction = routeGetNext(state, routes, sections, this.formGroup);
          if (routeAction && routeAction.event === 'wizardComplete') {
            this.stateChange({ complete: true });
            this.routeDir$.next('next');
            return;
          }

          // If a route action is supplied and this has all params
          if (routeAction && routeAction.routeParams && routeAction.routeParams.routeUrl) {
            // Update route history
            // Determine what to do next
            switch (routeAction.event) {
              case 'sectionComplete':
                this.sectionStateChange(sectionStateActions.sectionComplete());
                break;
            }
            // Update history and error states
            this.stateChange({ errorTop: false, errorBottom: false });
            this.routeDir$.next('next');
            // Reset page control state
            pageActive.controlsMarkAsUntouched();
            pageActive.pageTouched = false;
            // Reset any error state
            pageActive.errorChange(null);

            // Update section state
            if (routeAction.routeParams.routeUrl !== this.state.routeUrl) {
              this.sectionStateChange(
                sectionStateActions.routeNext({
                  sectionUrl: routeAction.routeParams.sectionUrl || '',
                  routeUrl: routeAction.routeParams.routeUrl || '',
                }),
              );
            }

            this.router.navigate([`${this.baseUrl}/${routeAction.routeParams.sectionUrl}/${routeAction.routeParams.routeUrl}`], {
              queryParamsHandling: 'merge',
            });
          }
        };

        // See if any async validators are attached
        const asyncValidators = this.validators?.filter(isType.validatorAsync).filter(v => v.id === pageActive.validatorId)[0];
        if (asyncValidators) {
          this.stateChange({ status: { nextWaiting: true } });
          asyncValidators
            .fn({ page: pageActive, form: this.formGroup })
            .pipe(take(1))
            .subscribe(r => {
              if (!r.valid) {
                pageActive.errorChange((r as NtsWizard.ValidatorFnError).errorMessage);
                this.stateChange({ status: { nextWaiting: false } });
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              } else {
                this.stateChange({ status: { nextWaiting: false } });
                routeNext();
              }
            });
        } else {
          // No async validators, perform normal
          routeNext();
        }
      });
  }

  /**
   * Go to previous route
   */
  public routePrevious() {
    this.routeDir$.next('back');

    this.sectionStateChange(sectionStateActions.routePrev());

    combineLatest([this.state$, this.sectionsState$])
      .pipe(debounceTime(1), take(1))
      .subscribe(([state, sectionsState]) => {
        const activeSection = sectionsState?.filter(s => s.active)[0];
        if (!activeSection) {
          console.warn('Unable to find active section on back button');
          return;
        }
        let routeParams = activeSection?.routeHistory[activeSection.routeHistory.length - 1];
        if (!routeParams && !!activeSection) {
          routeParams = {
            sectionUrl: activeSection.sectionId,
            routeUrl: activeSection.routeStart,
          };
        }
        this.router.navigate([`${this.baseUrl}/${routeParams.sectionUrl}/${routeParams.routeUrl}`]);
      });
  }

  /**
   *  Perform an action
   * @param actionsSrc
   */
  public actions(actions?: NtsWizard.Action | NtsWizard.Action[] | null) {
    if (!actions) {
      return;
    }

    const actionsArr = Array.isArray(actions) ? actions : [actions];
    actionsArr.forEach(a => {
      // Keep track of any post action items to do. Null = ignore, true = success, false = error
      // TODO: Add result handling for the other conditions
      let result: boolean | null = null;
      switch (a.type) {
        case 'refresh':
          this.refresh();
          break;
        case 'routeNext':
          this.routeNext();
          break;
        case 'routeBack':
          this.routePrevious();
          break;
        case 'routeGoTo':
          this.routeGoTo(a.route.routeParams);
          break;
        // TODO: Not sure if this is entirely working yet
        case 'sectionComplete':
          this.sectionStateChange(sectionStateActions.sectionComplete());
          break;
        case 'wizardComplete':
          this.stateChange({ complete: true });
          this.routeDir$.next('next');
          break;
        case 'dataChange':
          this.dataChange(a.field, a.value);
          break;
        case 'isValid':
          if (isValid(a.fields, this.formGroup)) {
            this.actions(a.onValid);
          }
          break;
        case 'markAsUntouched':
          setTimeout(() => {
            const c = this.formGroup?.get(a.field) as FormControl | FormGroup | FormArray;
            // If form group or form array, mark all children untouched, otherwise parent control won't be untouched
            if (c && isType.formGroup(c)) {
              Object.keys(c?.controls).forEach(key => c?.controls[key].markAsUntouched());
            } else if (c && isType.formArray(c)) {
              c.controls.forEach(c2 => c2.markAsUntouched());
            }
            // Mark root control untouched
            if (c) {
              c.markAsUntouched();
            }
          });
          break;
        case 'reset':
          const c = this.formGroup?.get(a.field) as FormControl | FormGroup | FormArray;
          if (c) {
            c.reset();
          }
          break;
        case 'createItem':
          createItem(this.formGroup, a);
          break;
        case 'copyItem':
          copyItem(this.formGroup, a);
          break;
        case 'arrayUpsertItem':
          // Get the formfield control reference for this model
          const r = stringToFormControl(a.fieldFrom, this.formControls);
          // Perform upset
          result = arrayUpsertItem(this.formGroup, a, r);
          break;
        case 'arrayDeleteItem':
          result = arrayDeleteItem(this.formGroup, a);
          break;
        default:
          console.log('No condition added for this action:', a.type, a);
          break;
        // TODO: Add button actions for wizard complete and section complete
      }

      // Emit action to parent
      this.actions$.next(a);

      // If action has success or error actions
      if (result !== null && result === true && !!a.actions?.onSuccess) {
        this.actions(a.actions.onSuccess);
      } else if (result !== null && result === false && !!a?.actions?.onError) {
        this.actions(a.actions.onError);
      }
    });
  }

  /**
   * Make data changes to the form model
   * @param path A path to get a form control in form control format. IE app.0.user.1.name
   * @param value The value to update the form control with
   */
  public dataChange(path: string, value: any) {
    if (!this.formGroup) {
      return;
    }
    // Get form control
    const control = this.formGroup.get(getFormControlPath(path));
    // Nil check, if success patch value
    if (control) {
      control.patchValue(value);
      control.markAsDirty();
    } else {
      console.error(`<Wizard> Unable to find a control of `, path);
    }
  }
}

export const wizardStore = (router: Router, location: Location) => new WizardStore(router, location);
