import { number, boolean } from '@storybook/addon-knobs';
import { PageComponent } from './page.component';

export default {
  title: 'PageComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [],
  },
  component: PageComponent,
  props: {
    // viewModels: text('viewModels', ),
    // page: text('page', ),
    // settings: text('settings', ),
    // tnSettings: text('tnSettings', ),
    docIndex: number('docIndex', 0),
    pageIndex: number('pageIndex', 0),
    isSelected: boolean('isSelected', false),
    isActive: boolean('isActive', false),
    canDropFromAny: boolean('canDropFromAny', true),
  },
});
