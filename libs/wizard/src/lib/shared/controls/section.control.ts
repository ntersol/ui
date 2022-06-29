import { NtsWizard } from '../../wizard.models';
import { clone } from '../../utils/misc.util';
import { assign } from '../../utils/assign.util';
import { FormGroup } from '@angular/forms';
import { expressionReplacer } from '../../utils';

export const sectionControlCreate = (
  section: NtsWizard.Section,
  position: number,
  form: FormGroup,
  routeCount = 0,
): NtsWizard.SectionControl => {
  const src = clone<NtsWizard.Section>(section);
  return assign<NtsWizard.SectionControl>(src, {
    src: src,
    position: position,
    routeCount: routeCount,
    get title() {
      return expressionReplacer(form, section.title);
    },
  } as NtsWizard.SectionControl);
};
