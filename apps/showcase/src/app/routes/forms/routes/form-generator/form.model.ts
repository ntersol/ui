import { Forms } from 'libs/forms/src/lib/forms.model';

interface User {
  nameFirst?: string;
  nameLast?: string;
  age?: number | null;
  address?: {
    city?: string;
    state?: string;
  };
  emails?: string[];
  email?: string;
}

export const userModel: User = {
  nameFirst: '',
  nameLast: '',
  age: null,
  address: {
    city: '',
    state: '',
  },
  email: '',
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
  {
    type: 'formField',
    formFieldType: 'number',
    label: 'Age',
    field: 'age',
    minFractionDigits: 0,
    maxFractionDigits: 0,
    useGrouping: false,
    maxLength: 3,
    max: 125,
  },
  {
    type: 'formField',
    formFieldType: 'email',
    label: 'Email Address',
    field: 'email',
  },
];

export const layoutModel: Forms.FormGenerator = [
  {
    type: 'container',
    cssClasses: 'layout-border',
    content: [
      {
        type: 'row',
        columns: [
          {
            type: 'column',
            content: [
              { type: 'html', html: '<h3>Personal Information</h3><p><em>Useful information to have</em></p>' },
            ],
            width: 6,
          },
          {
            type: 'column',
            content: [
              {
                type: 'container',
                cssClasses: 'border',
                content: [
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
                ],
              },
            ],
            width: 6,
          },
        ],
      },
    ],
  },
];

export const formFieldsModel: Forms.FormGenerator = [
  {
    type: 'formField',
    formFieldType: 'text',
    label: 'Text Field <strong>with HTML in title</strong>',
    field: 'text',
  },
  {
    type: 'formField',
    formFieldType: 'number',
    label: 'Number Field',
    field: 'number',
    hint: 'Supports decimals and has a comma separator',
  },
  {
    type: 'formField',
    formFieldType: 'number',
    label: 'Number Field',
    field: 'number2',
    maxFractionDigits: 0,
    useGrouping: false,
    hint: 'No decimal or comma separator',
  },
  {
    type: 'formField',
    formFieldType: 'number',
    mode: 'currency',
    label: 'Number Field For Currency',
    field: 'currency',
  },
  {
    type: 'formField',
    formFieldType: 'date',
    label: 'Date Field',
    field: 'date',
  },
  {
    type: 'formField',
    formFieldType: 'dropdown',
    label: 'Dropdown',
    field: 'dropdown',
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
    ],
  },
  {
    type: 'formField',
    formFieldType: 'email',
    label: 'Email Field',
    field: 'email',
  },
  {
    type: 'formField',
    formFieldType: 'phoneNumber',
    label: 'Phone Number Field',
    field: 'phoneNumber',
  },
  {
    type: 'formField',
    formFieldType: 'radio',
    label: 'Radio',
    field: 'radio',
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
    ],
  },
  {
    type: 'formField',
    formFieldType: 'selectButton',
    label: 'Select Button',
    field: 'selectButton',
    options: [
      { label: 'California', value: 'CA' },
      { label: 'New York', value: 'NY' },
    ],
  },
  {
    type: 'formField',
    formFieldType: 'textarea',
    label: 'Text Area Field',
    field: 'textArea',
  },
  {
    type: 'formField',
    formFieldType: 'zipcode',
    label: 'Zipcode Field',
    field: 'zipCode',
  },
];

export const htmlModel: Forms.FormGenerator = [
  {
    type: 'html',
    html: `
      <h1>A Page Title</h1>
      <p>Page description</p>
      <hr/>
      <div style="display:flex;" class="d-flex">
        <div class="p-3">Column 1</div>
        <div class="p-3">Column 2</div>
      </div>
      <hr/>
    `,
  },
];

export const dynamnicModel: Forms.FormGenerator = [
  {
    type: 'html',
    html: `
      <h1>Borrower Name: {{nameFirst}} {{nameLast}}</h1>`,
  },
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
  {
    type: 'formField',
    formFieldType: 'number',
    label: 'Age of <strong>{{nameFirst}} {{nameLast}}</strong>',
    field: 'age',
  },
];

export const visibilityModel: Forms.FormGenerator = [
  {
    type: 'row',
    columns: [
      {
        type: 'column',
        width: 6,
        content: [
          {
            type: 'formField',
            formFieldType: 'radio',
            label: 'Toggle Content',
            field: 'toggle',
            options: [
              { label: 'Show', value: true },
              { label: 'Hide', value: false },
            ],
          },
        ],
      },
      {
        type: 'column',
        width: 6,
        content: [
          {
            type: 'container',
            visible: 'toggle',
            content: [
              {
                type: 'html',
                html: 'Container content type',
              },
            ],
          },
          {
            type: 'html',
            html: '<hr/>',
          },

          {
            type: 'row',
            visible: 'toggle',
            columns: [
              {
                type: 'column',
                width: 12,
                content: [
                  {
                    type: 'html',
                    html: 'Row content type',
                  },
                ],
              },
            ],
          },
          {
            type: 'html',
            html: '<hr/>',
          },
          {
            type: 'row',
            columns: [
              {
                type: 'column',
                width: 6,
                content: [
                  {
                    type: 'html',
                    html: 'Column content type',
                  },
                ],
              },
              {
                type: 'column',
                visible: 'toggle',
                width: 6,
                content: [
                  {
                    type: 'html',
                    html: 'Column content type',
                  },
                ],
              },
            ],
          },
          {
            type: 'html',
            html: '<hr/>',
          },
        ],
      },
    ],
  },
];
