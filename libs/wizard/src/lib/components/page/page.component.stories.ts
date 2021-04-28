import { text } from '@storybook/addon-knobs';
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
    page: text('page', '') as any,
    dataFields: text('dataFields', {} as any),
    templates: text('templates', {} as any),
  },
});
