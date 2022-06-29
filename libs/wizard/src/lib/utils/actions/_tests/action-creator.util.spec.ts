import * as actions from '../section-state.actions';

// @ponicode
describe('Wizard actions and action creator', () => {
  let inst = actions;

  const payload = {
    sectionStart: 'start',
    sectionState: [],
  };
  const init = inst.sectionStateActions.initial(payload, 'Hello World');

  test('should have initial action', () => {
    expect(init.type).toBe('INITIAL');
  });

  test('initial action should have correct payload', () => {
    expect(init.payload).toBe(payload);
  });

  test('initial action should have correct meta', () => {
    expect(init.meta).toBe('Hello World');
  });

  // Action
  const action2 = actions.sectionStateActions.sectionChange('test');

  test('action should have correct type', () => {
    expect(typeof action2.payload).toBe('string');
  });
});
