import { Wizard } from '../../wizard';
import { isType } from '../typeguards.util';

/**
 * Generate the route history by starting at the beginning of the section and stopping when it hits the current route
 * @param sectionActive 
 * @param routes 
 * @param pages 
 */
export const routeCreateHistory = (
  sectionActive: Wizard.SectionControl,
  routes: Record<string, Wizard.RouteControl>,
): string[] => {
  console.log(sectionActive, routes);
  const history: string[] = [];

  let routeUrlSlug = sectionActive.routeStart;
  while (!history.includes(routeUrlSlug)) {
    history.push(routeUrlSlug);
    const routeNext = routes[routeUrlSlug].routeNext;
    if (isType.ruleGroup(routeNext)) {
        console.log('Add logic for rulegroup', routeNext);
        /**
         * Next route is static
         */
      } else if (typeof routeNext === 'string') {
        
      }
    routeUrlSlug = routes[routeUrlSlug].urlSlug;
  }

  return history;
};


