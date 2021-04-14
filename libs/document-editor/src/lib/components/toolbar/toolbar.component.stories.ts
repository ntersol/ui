import { text, number, boolean } from '@storybook/addon-knobs';
import { ToolbarComponent } from './toolbar.component';

export default {
  title: 'ToolbarComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: ToolbarComponent,
  props: {
    state: text('state', ),
    thumbnailSizes: text('thumbnailSizes', ),
  }
})