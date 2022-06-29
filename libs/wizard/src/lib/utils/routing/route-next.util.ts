import { FormGroup } from '@angular/forms';
import { NtsWizard } from '../../wizard.models';
import { rulesEngine } from '../rules-engine/rules-engine.util';
import { isType } from '../typeguards.util';

/**
 * Get next route
 * @param state
 * @param routes
 * @param sections
 */
export const routeGetNext = (
  state: NtsWizard.State,
  routes: Record<string, Record<string, NtsWizard.RouteControl>>,
  sections: Record<string, NtsWizard.SectionControl>,
  form: FormGroup,
): NtsWizard.RouteAction | null => {
  // Get current section
  const sectionCurrent = sections[state.sectionUrl];
  // Get current route
  const routeCurrent = routes[state.sectionUrl][state.routeUrl];

  /**
   * Wizard Complete, both route and section marked complete
   */
  if (sectionCurrent.wizardComplete && isType.routeComplete(routeCurrent)) {
    return {
      event: 'wizardComplete',
    };
    /**
     * Section Complete
     */
  } else if (isType.routeComplete(routeCurrent)) {
    let sectionNext: NtsWizard.SectionControl | null = null;
    for (let index = 0; index < Object.keys(sections).length; index++) {
      const key = Object.keys(sections)[index];
      if (sectionCurrent.position + 1 === sections[key].position) {
        sectionNext = sections[key];
        break;
      }
    }
    if (isType.sectionControl(sectionNext)) {
      return {
        event: 'sectionComplete',
        routeParams: { sectionUrl: sectionNext.urlSlug, routeUrl: sectionNext.routeStart },
      };
    } else {
      console.error(`<Wizard> Ruleset evaluation returned no matches. `, routeCurrent, sectionNext);
    }

    return null;
    /**
     * Next route is a rulegroup
     */
  } else if (isType.routeNext(routeCurrent) && isType.ruleGroup(routeCurrent.routeNext)) {
    const routeNext = rulesEngine(form, routeCurrent.routeNext);
    // Check if the matched rulegroup is a section complete
    if (routeNext && routeNext.sectionComplete) {
      let sectionNext: NtsWizard.SectionControl | null = null;
      for (let index = 0; index < Object.keys(sections).length; index++) {
        const key = Object.keys(sections)[index];
        if (sectionCurrent.position + 1 === sections[key].position) {
          sectionNext = sections[key];
          break;
        }
      }
      if (isType.sectionControl(sectionNext)) {
        return {
          event: 'sectionComplete',
          routeParams: { sectionUrl: sectionNext.urlSlug, routeUrl: sectionNext.routeStart },
        };
      } else {
        console.error(`<Wizard> Ruleset evaluation returned no matches. `, routeCurrent, sectionNext);
      }
      // Not a section complete, just go to next route
    } else if (routeNext) {
      return {
        event: 'routeNext',
        routeParams: { sectionUrl: routeCurrent.sectionId, routeUrl: routeNext.routeNext },
      };
    } else {
      console.error(`<Wizard> Ruleset evaluation returned no matches. `, routeCurrent);
    }

    /**
     * Next route is static
     */
  } else if (isType.routeNext(routeCurrent) && !isType.ruleGroup(routeCurrent.routeNext)) {
    const routeNext = routes[state.sectionUrl][routeCurrent.routeNext];

    if (routeNext && routeNext.sectionId && routeNext.urlSlug) {
      return {
        event: 'routeNext',
        routeParams: { sectionUrl: routeNext.sectionId, routeUrl: routeNext.urlSlug },
      };
    } else {
      console.error('<Wizard> That section and route combination does not exist:', state.sectionUrl, routeCurrent.routeNext);
    }
  }

  return null;
};
