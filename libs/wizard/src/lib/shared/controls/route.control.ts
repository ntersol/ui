import { Wizard } from '../../wizard';
import { assign } from '../../utils/assign.util';
import { clone } from '../../utils/misc.util';

/**
 * Create a new route control
 * @param route
 * @param form
 * @param indexes
 * , form: FormGroup, indexes: FormGroup
 */
export const routeControlCreate = (route: Wizard.Route): Wizard.RouteControl => {
  const src = clone<Wizard.Route>(route);
  return assign<Wizard.RouteControl>(src, {
    src: route
  });
};
