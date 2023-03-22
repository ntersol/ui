import { Forms } from 'libs/forms/src/lib/forms.model';

interface User {
  nameFirst?: string;
  nameLast?: string;
  address?: {
    city?: string;
    state?: string;
  };
  emails?: string[];
}

export const userModel: User = {
  nameFirst: '',
  nameLast: '',
  address: {
    city: '',
    state: '',
  },
  emails: [],
};

export const formModel: Forms.FormGenerator = [
  {
    type: 'formField',
    formFieldType: 'text',
    label: 'First Name',
    field: 'nameFirst',
  },
  {
    type: 'formField',
    formFieldType: 'text',
    label: 'Last Name',
    field: 'nameLast',
  },
];
