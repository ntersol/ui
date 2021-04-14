import { text, number, boolean } from '@storybook/addon-knobs';
import { ViewerToolbarComponent } from './viewer-toolbar.component';

export default {
  title: 'ViewerToolbarComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: ViewerToolbarComponent,
  props: {
    document: text('document', ),
    viewerOptions: text('viewerOptions', ),
    pageActive: text('pageActive', ),
    rotation: number('rotation', 0),
  }
})