import { Wizard } from '../wizard.models';

/**
 * Generate the initial section state
 */
export const sectionStateCreate = (sections: Wizard.Section[]): Wizard.SectionState[] =>
  sections.map((s) =>
    Object.assign({
      sectionId: s.urlSlug,
      active: false,
      completed: false,
      completedDate: null,
      routeHistory: [],
      routeStart: s.routeStart,
      started: false,
      startedDate: null,
    } as Wizard.SectionState),
  );
