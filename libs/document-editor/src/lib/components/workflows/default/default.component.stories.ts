import { text, number, boolean } from '@storybook/addon-knobs';
import { DefaultComponent } from './default.component';

export default {
  title: 'DefaultComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: DefaultComponent,
  props: {
    documents: text('documents', ),
    viewModels: text('viewModels', ),
    settings: text('settings', ),
    tnSettings: text('tnSettings', ),
    selection: text('selection', []),
    pageActive: text('pageActive', ),
    pdfInfo: text('pdfInfo', ),
    pdfSrcs: text('pdfSrcs', ),
    rotation: number('rotation', 0),
  }
})