import { text, number, boolean } from '@storybook/addon-knobs';
import { ViewerComponent } from './viewer.component';

export default {
  title: 'ViewerComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: ViewerComponent,
  props: {
    pdfSrcs: text('pdfSrcs', ),
    document: text('document', ),
    viewerOptions: text('viewerOptions', ),
    pageActive: text('pageActive', ),
    rotation: number('rotation', 0),
  }
})