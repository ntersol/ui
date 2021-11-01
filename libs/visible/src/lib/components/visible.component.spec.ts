import { fakeAsync, tick } from '@angular/core/testing';
import '@testing-library/jest-dom';
import { VisibleComponent } from './visible.component';
import { render, screen } from '@testing-library/angular'
import { MediaBreakpoints } from './visible.models';
import * as utils from './visible.utils';
import { of } from 'rxjs';


describe('VisibleComponent', () => {
  it('renders component', async () => {
    const r = await setup('all', true, true);
    expect(r.fixture.componentInstance).toBeTruthy();
  })
  describe('Using Browser', () => {
    it('given show$ returns true, should render ng-content', async () => {
      const r = await setup('all', true, true);
      expect(screen.queryByTestId('ssr')).not.toBeInTheDocument();
    });
    // it('given show$ returns false, should not render ng-content', async () => {
    //   const r = await setup('all', true, false);
    //   expect(screen.queryByTestId('ssr')).not.toBeInTheDocument();
    // });
    it('given visible.utils isVisible returns true, should emit true for isVisible output', fakeAsync(async () => {
      const r = await setupBrowser(true)
      tick(500)
      expect(r.isVisibleSpy).toHaveBeenCalled();
      expect(r.isVisibleSpy).toHaveBeenCalledWith(true);
      expect(screen.queryByTestId('ssr')).not.toBeInTheDocument();
    }));
    it('given visible.utils isVisible returns false, should emit false for isVisible output', fakeAsync(async () => {
      const r = await setupBrowser(false)
      tick(500)
      expect(r.isVisibleSpy).toHaveBeenCalled();
      expect(r.isVisibleSpy).toHaveBeenCalledWith(false);
      expect(screen.queryByTestId('ssr')).not.toBeInTheDocument;
    }));
  })
  describe('Using Server Side Rendering', () => {
    it('should render ng-content', async () => {
      const r = await setup('all', false, true)
      expect(screen.queryByTestId('ssr')).toBeInTheDocument();
    });
  })
});

async function setup(visible: MediaBreakpoints = 'all', isBrowser: boolean = true, show: boolean = true, isVisibleEmit = jest.fn()) {
  const { fixture, rerender } = await render(VisibleComponent, {
    componentProperties: {
      //  Input
      visible: visible,
      //  Output
      //  Currently only triggered by show$ so no use here when show$ is mocked
      // isVisible: {
      //   emit: isVisibleEmit
      // } as any,
      //  Properties
      isBrowser: isBrowser,
      show$: of(show)
    }
  });

  return {
    fixture,
    rerender,
    isVisibleEmit
  };
}
/**
 * Primarily used to test the output isVisible
 * since isVisible output only emits on the observable for show$ we will not
 * mock that in this function
 */
async function setupBrowser(utilIsVisible: boolean = true) {
  jest.spyOn(utils, 'isVisible').mockReturnValue(utilIsVisible);
  //  Allows for browser to be true before render and before show$ is assigned observable
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn().mockImplementation(() => ({})),
  });
  const isVisibleSpy = jest.fn();
  const { fixture } = await render(VisibleComponent, {
    componentProperties: {
      isVisible: {
        emit: isVisibleSpy
      } as any
    }
  });
  return {
    fixture,
    isVisibleSpy
  }
}