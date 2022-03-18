import { Wizard } from '../wizard.models';

export type SectionChangeType =
  | 'initial'
  | 'routeChange'
  | 'routePrev'
  | 'sectionChange'
  | 'sectionComplete'
  | 'wizardComplete';

/**
 * Reducer to manage section state changes
 * @param sectionsSrc
 * @param action
 * @param sectionNext
 * @param routeHistory
 */
export const sectionStateChange = (
  sectionsSrc: Wizard.SectionState[],
  action: SectionChangeType,
  sectionNext?: string,
  routeHistorySrc?: string[],
): Wizard.SectionState[] => {
  // console.warn(sectionsSrc, action, sectionNext, routeHistory);
  const sections = [...sectionsSrc];
  const routeHistory = routeHistorySrc ? [...routeHistorySrc] : [];
  switch (action) {
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
          section.routeHistory = [section.routeStart];
        }
        return section;
      });
    case 'routeChange':
      // Attach route history to active route
      return sections.map((s) => (s.active ? { ...s, routeHistory: routeHistory } : s));
    case 'routePrev':
      // Remove route from
      return sections.map((s) => {
        const rtHistory = s.routeHistory;
        if (s.active && rtHistory.length) {
          rtHistory.length = s.routeHistory.length - 1;
        }
        return s.active ? { ...s, routeHistory: rtHistory } : s;
      });
    case 'sectionChange':
      return sections.map((s) => {
        const section = { ...s };
        // If section has not been started yet, set start flag and date
        if (!section.started) {
          section.started = true;
          section.startedDate = new Date();
        }
        // Set active for current section, inactive for all others
        return section.sectionId === sectionNext
          ? { ...section, active: true, routeHistory: routeHistory }
          : { ...section, active: false };
      });
    case 'sectionComplete':
      return sections.map((s) => {
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
