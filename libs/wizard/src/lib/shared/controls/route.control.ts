import { NtsWizard } from '../../wizard.models';
import { assign } from '../../utils/assign.util';
import { clone } from '../../utils/misc.util';

/**
 * Create a new route control
 * @param route
 * @param form
 * @param indexes
 * , form: FormGroup, indexes: FormGroup
 */
export const routeControlCreate = (route: NtsWizard.Route): NtsWizard.RouteControl => {
  const src = clone<NtsWizard.Route>(route);
  return assign<NtsWizard.RouteControl>(src, {
    src: route,
  });
};
