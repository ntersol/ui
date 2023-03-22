import { Forms } from 'libs/forms/src/lib/forms.model';
import { Paths } from 'libs/forms/src/lib/utils/types.util';

interface User {
  nameFirst?: string;
  nameLast?: string;
  address?: {
    city?: string;
    state?: string;
  };
  emails?: string[];
  emails2?: { address?: string; url?: string }[];
}

export const formModel: Forms.FormGenerator = [
  {
    type: 'formField',
    formFieldType: 'text',
    field: 'emails2',
  },
];
