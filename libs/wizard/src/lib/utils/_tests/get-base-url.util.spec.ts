import { getBaseUrl } from '../get-base-url.util';

describe('Get base url', () => {
  test('should get root level slug without hash', () => {
    expect(
      getBaseUrl('/online-application/income/start?loanAppGuid=a823841f-15b5-4b12-be50-2fa85e8c3282', {
        sectionUrl: 'income',
        routeUrl: 'start',
      }),
    ).toBe('online-application');
  });

  test('should get root level slug with has', () => {
    expect(
      getBaseUrl('/#/online-application/income/start?loanAppGuid=a823841f-15b5-4b12-be50-2fa85e8c3282', {
        sectionUrl: 'income',
        routeUrl: 'start',
      }),
    ).toBe('#/online-application');
  });
});
