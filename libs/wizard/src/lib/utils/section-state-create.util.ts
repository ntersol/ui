import { NtsWizard } from '../wizard.models';

/**
 * Generate the initial section state
 */
export const sectionStateCreate = (sections: NtsWizard.Section[]): NtsWizard.SectionState[] =>
  sections.map(s =>
    Object.assign({
      sectionId: s.urlSlug,
      active: false,
      completed: false,
      completedDate: null,
      routeHistory: [],
      routeStart: s.routeStart,
      started: false,
      startedDate: null,
    } as NtsWizard.SectionState),
  );
