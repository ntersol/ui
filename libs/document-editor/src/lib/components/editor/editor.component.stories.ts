import { text, number, boolean } from '@storybook/addon-knobs';
import { EditorComponent } from './editor.component';

export default {
  title: 'EditorComponent'
}

export const primary = () => ({
  moduleMetadata: {
    imports: []
  },
  component: EditorComponent,
  props: {
    workflow: text('workflow', 'default'),
    pdfSrcs: text('pdfSrcs', ),
    pdfInfo: text('pdfInfo', ''),
    thumbnailSizes: text('thumbnailSizes', [
    { width: 60, height: 75 },
    { width: 100, height: 125 },
    { width: 200, height: 250 },
    { width: 400, height: 500 },
  ]),
    multipleAction: text('multipleAction', 'merge'),
    scrollbarRef: text('scrollbarRef', ),
    canRotate: boolean('canRotate', true),
    canReorder: boolean('canReorder', true),
    canRemove: boolean('canRemove', true),
    canSplit: boolean('canSplit', true),
    canSelect: boolean('canSelect', true),
    canViewFull: boolean('canViewFull', true),
    canReset: boolean('canReset', true),
    selection: text('selection', []),
    viewerOptions: text('viewerOptions', false),
    pdfJsSrc: text('pdfJsSrc', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.min.js'),
    pdfJsWorkerSrc: text('pdfJsWorkerSrc', 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.min.js'),
  }
})