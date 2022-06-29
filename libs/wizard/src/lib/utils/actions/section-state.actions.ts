import { NtsWizard } from '../..';
import { actionCreator } from './action-creator.util';

// Create and export an actions creator dictionary
export const sectionStateActions = {
  browserButton: actionCreator<Partial<NtsWizard.RouteParams>>('BROWSER_BUTTON'),
  initial: actionCreator<{
    sectionStart: string;
    sectionState: NtsWizard.SectionState[];
  }>('INITIAL'),
  reload: actionCreator<NtsWizard.SectionState[]>('RELOAD'),
  routeNext: actionCreator<NtsWizard.RouteParams>('ROUTE_CHANGE'),
  routePrev: actionCreator<void>('ROUTE_PREV'),
  sectionChange: actionCreator<string>('SECTION_CHANGE'),
  sectionComplete: actionCreator<string | void>('SECTION_COMPLETE'),
};
