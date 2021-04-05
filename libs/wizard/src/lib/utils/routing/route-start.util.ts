import { Wizard } from '../../wizard';

/**
 * Determine the initial starting route of the application based on supplied query params
 * @param params
 * @param sections
 */
export const routeStart = (params: Wizard.RouteParams, sections: Wizard.Section[]): Wizard.RouteParams => {
  if (params.sectionUrl === 'continue') {
    // Continue app
    console.warn('TODO: Add Continue all sections');
  } else if (params.sectionUrl && params.routeUrl && params.routeUrl === 'continue') {
    // Continue within a section
    console.warn('TODO: Add Continue within a section');
  } else if (params.sectionUrl && params.routeUrl && params.routeUrl !== 'continue') {
    // Go direct to route
    return { sectionUrl: params.sectionUrl, routeUrl: params.routeUrl };
  } else if (params.sectionUrl && !params.routeUrl) {
    // Has section but no route, add first route in section
    const section = sections.filter((s) => s.urlSlug === params.sectionUrl)[0];
    return { sectionUrl: params.sectionUrl, routeUrl: section.routeStart };
  }
  // Initial start, no section or route url supplied. Go to first section and first route
  return { sectionUrl: sections[0].urlSlug, routeUrl: sections[0].routeStart };
};
