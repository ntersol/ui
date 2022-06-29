import { NtsWizard } from '../wizard.models';
import { sectionStateActions } from './actions/section-state.actions';

/**
 *
 * @param sectionsSrc
 * @param action
 * @returns
 */
export const sectionStateChange = (sectionsSrc: NtsWizard.SectionState[], state: NtsWizard.State, action: NtsWizard.StateAction) => {
  // console.log(sectionsSrc, state, action);

  // Reload
  if (sectionStateActions.browserButton.match(action)) {
    return sectionsSrc.map(section => {
      // If this is the active section
      if (section.sectionId === state.sectionUrl) {
        // Get previous route
        const prevRoute = section.routeHistory[section.routeHistory.length - 2];
        // If the previous route matches the route params then this is a back button event
        if (!!prevRoute && prevRoute.sectionUrl === action.payload.sectionUrl && prevRoute.routeUrl === action.payload.routeUrl) {
          // Remove last item from route history
          return Object.assign({}, section, { routeHistory: section.routeHistory.slice(0, -1) });
        } else {
          // Forward button event
          // Add new route to route history
          return Object.assign({}, section, {
            routeHistory: [...section.routeHistory, { sectionUrl: action.payload.sectionUrl, routeUrl: action.payload.routeUrl }],
          });
        }
      }
      return section;
    });
  }

  // Route CHANGE action
  if (sectionStateActions.routeNext.match(action)) {
    return sectionsSrc.map(s => {
      if (s.sectionId === state.sectionUrl) {
        return Object.assign({}, s, {
          routeHistory: [...s.routeHistory, { sectionUrl: action?.payload?.sectionUrl || '', routeUrl: action.payload?.routeUrl || '' }],
        });
      }
      return s;
    });
  }

  // Route PREVIOUS action
  if (sectionStateActions.routePrev.match(action)) {
    // Store the index of the active section
    let currentSectionIndex = 0;
    // Get the active section
    const sectionActive = sectionsSrc.filter((s, i) => {
      if (s.sectionId === state.sectionUrl) {
        currentSectionIndex = i;
        return true;
      }
      return false;
    })[0];

    // Go to the previous section
    if (!!sectionActive && sectionActive.routeHistory.length === 1) {
      // Get previous section
      const sectionPrevious = sectionsSrc[currentSectionIndex - 1];
      // Handle edge conditions if previous section not found
      // This will also happen if the user is on the first route of the first section
      if (!sectionPrevious) {
        // console.warn('Error trying to go to previous section');
        return sectionsSrc;
      }
      //
      return sectionsSrc.map((section, i) => {
        // Set all active flags to false
        section.active = false;
        // Set next section to active
        if (i === currentSectionIndex - 1) {
          section.active = true;
        }
        if (section.sectionId === state.sectionUrl) {
          return Object.assign({}, section, { routeHistory: section.routeHistory.slice(0, -1) });
        }
        return section;
      });
    }
    // Remove last item from route history
    return sectionsSrc.map(s => {
      if (s.sectionId === state.sectionUrl) {
        return Object.assign({}, s, { routeHistory: s.routeHistory.slice(0, -1) });
      }
      return s;
    });
  }

  // Reload
  if (sectionStateActions.reload.match(action)) {
    return [...(action.payload || sectionsSrc)];
  }

  // Section Change
  if (sectionStateActions.sectionChange.match(action)) {
    return sectionsSrc.map(s => {
      const section = { ...s };
      // If section has not been started yet, set start flag and date
      if (!section.started) {
        section.started = true;
        section.startedDate = new Date();
      }
      // If the new section doesn't have any route history, set initial route
      const routeHistory = section.routeHistory.length
        ? [...section.routeHistory]
        : [{ routeUrl: section.routeStart, sectionUrl: section.sectionId }];
      // Set active for current section, inactive for all others
      // Changing a section starts the user at the beginning and resets the route history
      return section.sectionId === action.payload
        ? { ...section, active: true, routeHistory: routeHistory }
        : { ...section, active: false };
    });
  }

  // Section Change
  if (sectionStateActions.sectionComplete.match(action)) {
    return sectionsSrc.map(s => {
      const section = { ...s };
      // If section has not been started yet, set start flag and date
      if (!section.started) {
        section.started = true;
        section.startedDate = new Date();
      }
      // If this is the active section and it has not been completed yet, set flag and completed date
      if (section.active && !section.completed) {
        section.completed = true;
        section.completedDate = new Date();
      }
      // Set all active flags to false
      section.active = false;
      // Set next section to active
      if (section.sectionId === action.payload) {
        section.active = true;
        // section.routeHistory = routeHistory;
      }
      return section;
    });
  }

  // Create initial section state
  if (sectionStateActions.initial.match(action)) {
    return (action.payload.sectionState || []).map((s, i) => {
      const section = { ...s };
      // Set all sections to inactive
      section.active = false;
      // If no next section is supplied OR next section = current section
      if ((!action.payload.sectionStart && i === 0) || action.payload.sectionStart === section.sectionId) {
        section.active = true; // Set active
        // If active section does not yet have started flag and date, set it
        if (!section.started) {
          section.started = true;
          section.startedDate = new Date();
        }
        section.routeHistory = [{ routeUrl: section.routeStart, sectionUrl: section.sectionId }];
      }
      return section;
    });
  }

  return sectionsSrc;
};

export interface SectionChangeType {
  type: 'initial' | 'reload' | 'routeChange' | 'routePrev' | 'sectionChange' | 'sectionComplete' | 'wizardComplete';
  payload?: any;
}

/**
 * Reducer to manage section state changes
 * @param sectionsSrc
 * @param action
 * @param sectionNext
 * @param routeHistory
 */
export const sectionStateChange2 = (
  sectionsSrc: NtsWizard.SectionState[],
  action: SectionChangeType,
  sectionNext?: string,
  routeHistorySrc?: NtsWizard.RouteParams[],
): NtsWizard.SectionState[] => {
  // console.warn(sectionsSrc, action, sectionNext, routeHistorySrc);
  const sections = [...sectionsSrc];
  const routeHistory = routeHistorySrc ? [...routeHistorySrc] : [];
  switch (action.type) {
    case 'reload':
      return sections;
    case 'initial':
      return sections.map((s, i) => {
        const section = { ...s };
        // Set all sections to inactive
        section.active = false;
        // If no next section is supplied OR next section = current section
        if ((!sectionNext && i === 0) || sectionNext === section.sectionId) {
          section.active = true; // Set active
          // If active section does not yet have started flag and date, set it
          if (!section.started) {
            section.started = true;
            section.startedDate = new Date();
          }
          section.routeHistory = [{ routeUrl: section.routeStart, sectionUrl: section.sectionId }];
        }
        return section;
      });
    case 'routeChange':
      // Attach route history to active route
      return sections.map(s => (s.active ? { ...s, routeHistory: routeHistory } : s));
    case 'routePrev':
      console.warn(sectionsSrc, action, sectionNext, routeHistorySrc);
      // Remove route from
      return sections.map(s => {
        const rtHistory = s.routeHistory;
        if (s.active && rtHistory.length) {
          rtHistory.length = s.routeHistory.length - 1;
        }
        return s.active ? { ...s, routeHistory: rtHistory } : s;
      });
    case 'sectionChange':
      return sections.map(s => {
        const section = { ...s };
        // If section has not been started yet, set start flag and date
        if (!section.started) {
          section.started = true;
          section.startedDate = new Date();
        }
        // Set active for current section, inactive for all others
        // Changing a section starts the user at the beginning and resets the route history
        return section.sectionId === sectionNext
          ? { ...section, active: true, routeHistory: [{ routeUrl: section.routeStart, sectionUrl: section.sectionId }] }
          : { ...section, active: false };
      });
    case 'sectionComplete':
      return sections.map(s => {
        const section = { ...s };
        // If section has not been started yet, set start flag and date
        if (!section.started) {
          section.started = true;
          section.startedDate = new Date();
        }
        // If this is the active section and it has not been completed yet, set flag and completed date
        if (section.active && !section.completed) {
          section.completed = true;
          section.completedDate = new Date();
        }
        // Set all active flags to false
        section.active = false;
        // Set next section to active
        if (section.sectionId === sectionNext) {
          section.active = true;
          section.routeHistory = routeHistory;
        }
        return section;
      });
  }
  return sections;
};
