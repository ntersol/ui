import { text, number, boolean } from '@storybook/addon-knobs';
import { DisplayComponent } from './display.component';

export default {
  title: 'DisplayComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: DisplayComponent,
  props: {
    document: text('document', ),
    viewModels: text('viewModels', ),
    viewerOptions: text('viewerOptions', ),
    settings: text('settings', ),
    tnSettings: text('tnSettings', ),
    selection: text('selection', []),
    pageActive: text('pageActive', ),
    pdfInfo: text('pdfInfo', ),
    pdfSrcs: text('pdfSrcs', ),
    rotation: number('rotation', 0),
  }
})