import { pageViewCreate } from './canvas-create.util';
import { pdfjsDist } from '../models/pdf';

/**
 * Create the default pages model from the source pdf
 * @param pdf
 */
export const viewModelCreate = (pdfs: pdfjsDist.PDFDocumentProxy[], width: number, height: number) => pdfs.map(pdf => pageViewCreate(pdf, width, height));
