import actionCreatorFactory from 'typescript-fsa';
import { AppStore } from '$shared';

const actionCreator = actionCreatorFactory('ui');

export const UIStoreActions = {
  RESET: actionCreator<null>('RESET'),
  REHYDRATE: actionCreator<AppStore.Ui>('REHYDRATE'),
  MODAL_OPEN: actionCreator<{
    modalId: string;
    options: { size: 'sm' | 'lg' | 'xl' | 'full'; windowClass: string };
    data: any;
    dataAlt: any;
  }>('MODAL_OPEN'),
  MODAL_UNLOAD: actionCreator<null>('MODAL_UNLOAD'),
  TAB_CHANGE: actionCreator<{ tabInstanceId: string; tabId: string }>('TAB_CHANGE'),
  MULTISCREEN_TOGGLE: actionCreator<boolean | null>('MULTISCREEN_TOGGLE'),
};
