import { number, boolean } from '@storybook/addon-knobs';
import { DocumentComponent } from './document.component';

export default {
  title: 'DocumentComponent',
};

export const primary = () => ({
  moduleMetadata: {
    imports: [],
  },
  component: DocumentComponent,
  props: {
    // document: text('document', ),
    // viewModels: text('viewModels', ),
    // settings: text('settings', ),
    // tnSettings: text('tnSettings', ),
    // selection: text('selection', []),
    // pageActive: text('pageActive', ),
    // pdfInfo: text('pdfInfo', ),
    docIndex: number('docIndex', 0),
    canDropFromAny: boolean('canDropFromAny', true),
  },
});
