import { text, number, boolean } from '@storybook/addon-knobs';
import { PageComponent } from './page.component';

export default {
  title: 'PageComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: PageComponent,
  props: {
    page: text('page', ),
    dataFields: text('dataFields', {}),
    templates: text('templates', {}),
  }
})