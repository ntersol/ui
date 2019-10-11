import { map } from 'rxjs/operators';
import { EntityState } from '@datorama/akita';

export const entityWithData = <t>(state?: EntityState<t>) =>
  map(() => {
    if (state && state.ids) {
      return {
        ...state,
        data: state.ids
          .map(id =>
            state.entities && state.entities[id] ? state.entities[id] : null,
          )
          .filter((x): x is t => (!x ? true : false)),
      };
    }
    return { ...state, data: [] };
  });
