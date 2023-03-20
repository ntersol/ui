import { DecimalPipe, TitleCasePipe, UpperCasePipe, LowerCasePipe, DatePipe } from '@angular/common';

/**
 * Apply angular or other common pipe transformations to input data
 * Available Angular Pipes: number, date
 * Available custom pipes are: splitTitleCase, titlecase, uppercase, lowercase
 * TODO: Support more pipes
 * @param data
 * @param pipe
 * @returns
 */
export const applyPipeFormatting = (data?: string | null, pipe?: string[] | null) => {
  // Nill check
  if (data === undefined || data === null || pipe === undefined || pipe === null) {
    return data;
  }
  let str = data;
  // Loop through each pipe
  pipe.forEach((s) => {
    // Split to extract pipe args
    // Trim all strs and replce any single quotes to avoid double nested strings
    const split = s.split(':').map((s) => (s || '')?.trim()?.replace(/'/g, ''));
    const pipe = split[0]; // Get pipes
    const args = split[1]; // Get pipe args
    switch (pipe) {
      // Number pipe
      case 'number':
        const decimalPipe = new DecimalPipe('en');
        str = decimalPipe.transform(typeof str === 'number' ? str : parseInt(str), args) || '';
        break;
      // Add spaces to a string with title cases, IE "MyLoanInfo" => "My Loan Info"
      case 'splitTitleCase':
        str = str
          .split('')
          .map((c) => (c === c.toUpperCase() ? ' ' + c : c))
          .join('')
          .trim();
        break;
      case 'titlecase':
        const titleCasePipe = new TitleCasePipe();
        str = titleCasePipe.transform(str) || '';
        break;
      case 'uppercase':
        const upperCasePipe = new UpperCasePipe();
        str = upperCasePipe.transform(str) || '';
        break;
      case 'lowercase':
        const lowerCasePipe = new LowerCasePipe();
        str = lowerCasePipe.transform(str) || '';
        break;
      case 'date':
        const datePipe = new DatePipe('en');
        str = datePipe.transform(str, args) || '';
        break;
    }
  });

  return str;
};
