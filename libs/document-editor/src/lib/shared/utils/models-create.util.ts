import { NtsDocumentEditor } from '../models/document-editor.model';
import { pdfjsDist } from '../models/pdf';

/**
 *
 * @param pdf
 */
export const documentModelCreate = (pdfs: pdfjsDist.PDFDocumentProxy[]): NtsDocumentEditor.Document[] => {
  return pdfs.map((pdf, i) => {
    return <NtsDocumentEditor.Document>{
      label: 'Document #' + (i + 1),
      pages: pageModelCreate(pdf, i),
    };
  });
};

/**
 * Merge all documents into one single doc by combining pages
 * @param pdfs
 */
export const documentMerge = (pdfs: NtsDocumentEditor.Document[]) => [
  pdfs.reduce((a, b) => Object.assign({}, a, b, { pages: [...a.pages, ...b.pages], label: 'Document #1' })),
];

/**
 * Create the default pages model from the source pdf
 * @param pdf
 */
export const pageModelCreate = (pdf: pdfjsDist.PDFDocumentProxy, pdfSrcIndex: number) => {
  const pageModel: NtsDocumentEditor.Page[] = [];
  for (let index = 0; index < pdf.numPages; index++) {
    pageModel.push({
      pdfSrcIndex: pdfSrcIndex,
      pageSrcIndex: index,
      excluded: false,
      rotation: 0,
      annotations: null,
    });
  }
  return pageModel;
};
