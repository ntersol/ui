// Import action creator
import { actionCreator } from '@ntersol/state-management';

// Standalone action creator
export const tokenChangedAction = actionCreator<string | null>('TOKEN_CHANGED')