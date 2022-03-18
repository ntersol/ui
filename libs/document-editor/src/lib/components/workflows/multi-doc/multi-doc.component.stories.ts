import { number } from '@storybook/addon-knobs';
import { MultiDocComponent } from './multi-doc.component';

export default {
  title: 'MultiDocComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [],
  },
  component: MultiDocComponent,
  props: {
    // documents: text('documents', ),
    // viewModels: text('viewModels', ),
    // settings: text('settings', ),
    // tnSettings: text('tnSettings', ),
    // selection: text('selection', []),
    // pageActive: text('pageActive', ),
    // pdfInfo: text('pdfInfo', ),
    // pdfSrcs: text('pdfSrcs', ),
    rotation: number('rotation', 0),
  },
});
