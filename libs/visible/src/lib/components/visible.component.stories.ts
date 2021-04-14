import { text } from '@storybook/addon-knobs';
import { VisibleComponent } from './visible.component';

export default {
  title: 'VisibleComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [],
  },
  component: VisibleComponent,
  props: {
    visible: text('visible', 'all'),
  },
});
