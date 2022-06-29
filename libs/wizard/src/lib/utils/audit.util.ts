import { NtsWizard } from '../wizard.models';
import { arrayToRecord } from './misc.util';

const errorAppend = `<Wizard> `;
/**
 * Find common mistakes in inputs
 */
export const audit = (sections: NtsWizard.Section[], pages: NtsWizard.Page[], routes: NtsWizard.Route[]) => {
  const sectionsRecord = arrayToRecord<NtsWizard.Section>(sections, 'urlSlug');

  const pagesRecord: Record<string, Record<string, NtsWizard.Page>> = {};
  pages.forEach(p => {
    if (!pagesRecord[p.sectionId]) {
      pagesRecord[p.sectionId] = {};
    }
    pagesRecord[p.sectionId][p.id] = p;
    if (!sectionsRecord[p.sectionId]) {
      console.error(errorAppend + 'Pages sectionID does not match any supplied sections ', p);
    }
  });

  /**
   * Create routes record
   */
  const routesRecord: Record<string, Record<string, NtsWizard.Route>> = {};
  routes.forEach(r => {
    if (!routesRecord[r.sectionId]) {
      routesRecord[r.sectionId] = {};
    }
    if (routesRecord[r.sectionId] && routesRecord[r.sectionId][r.urlSlug]) {
      console.error(errorAppend + `Duplicate urlSlug property found for ${r.urlSlug}. A routes urlSlug must be unique within a section`, r);
    }
    if (!sectionsRecord[r.sectionId]) {
      console.error(errorAppend + 'Unable to find that sectionID of ' + r.sectionId + ' for route ', r);
    }
    if (!pagesRecord[r.sectionId][r.pageId]) {
      console.error(errorAppend + `Unable to find a page with a pageId of ${r.pageId} for section ${r.sectionId}`, r);
    }

    routesRecord[r.sectionId][r.urlSlug] = r;
  });

  /**
   * Loop through sections after all records have been created

  Object.keys(sectionsRecord).forEach(key => {
    const section: any = <any>sectionsRecord[key];

    if (section.sectionNext && !sectionsRecord[section.sectionNext || '']) {
      console.error(errorAppend + 'Cannot find a section with this sectionNext prop: ', sectionsRecord[key]);
    }
    if (!section.sectionNext && !section.sectionLast) {
      console.error(errorAppend + 'This section is missing either a sectionNext or sessionLast prop. Need either one ', sectionsRecord[key]);
    }

  });
   */

  /**
   * Loop through Routes after all records have been created
   */
  Object.keys(routesRecord).forEach(key => {
    const section = routesRecord[key];
    Object.keys(routesRecord).forEach(key2 => {
      const route = section[key2];
      if (!route) {
      }
    });
  });
};
