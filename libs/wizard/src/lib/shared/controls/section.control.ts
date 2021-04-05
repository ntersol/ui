import { Wizard } from '../../wizard';
import { clone } from '../../utils/misc.util';
import { assign } from '../../utils/assign.util';

export const sectionControlCreate = (
  section: Wizard.Section,
  position: number,
  expressionReplacer: (str: string | null | undefined) => string,
  routeCount = 0
): Wizard.SectionControl => {
  const src = clone<Wizard.Section>(section);
  return assign<Wizard.SectionControl>(src, {
    src: src,
    position: position,
    routeCount: routeCount,
    get title() {
      return expressionReplacer(section.title);
    },
  } as Wizard.SectionControl);
};
