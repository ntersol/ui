import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsForms } from 'libs/forms/src/lib/forms.model';

@Component({
  selector: 'nts-visibility',
  templateUrl: './visibility.component.html',
  styleUrls: ['./visibility.component.scss'],
})
export class VisibilityComponent implements OnInit {
  public visibilityModel: NtsForms.FormGenerator = [
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
    {
      type: 'container',
      visible: 'toggle',
      cssClasses: 'border',
      content: [
        {
          type: 'html',
          html: 'Container content type',
        },
      ],
    },
    {
      type: 'container',
      visible: '!toggle',
      cssClasses: 'border',
      content: [
        {
          type: 'html',
          html: 'Container content type reversed',
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
      cssClasses: 'border',
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
          visible: 'toggle',
          cssClasses: 'border',
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
          width: 6,
          cssClasses: 'border',
          content: [
            {
              type: 'html',
              html: 'Column content type not hidable',
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
              html: 'Rules Engine Example',
            },
            {
              type: 'formField',
              formFieldType: 'text',
              label: 'Toggle Content',
              field: 'toggle2',
              hint: 'Enter a number over 5 to toggle visibility',
            },
          ],
        },
        {
          type: 'column',
          width: 6,
          content: [
            {
              type: 'html',
              html: 'No number has been entered',
              cssClasses: 'border',
              visible: '!toggle2',
            },
            {
              type: 'html',
              html: 'The number is greater than 5',
              cssClasses: 'border',
              visible: {
                field: 'toggle2',
                operator: 'gt',
                value: 5,
              },
            },
            {
              type: 'html',
              html: 'The number is less than 6',
              cssClasses: 'border',
              visible: {
                field: 'toggle2',
                operator: 'lt',
                value: 6,
              },
            },
          ],
        },
      ],
    },
  ];
  public visibilityForm = this.fb.group({
    toggle: true,
    toggle2: null,
  });
  public visibilityCode = `
  // Source toggle
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

// Dynamic visibility for each content type
{
  type: 'container',
  visible: 'toggle',
  cssClasses: 'border',
  content: [
    {
      type: 'html',
      html: 'Container content type',
    },
  ],
},
// Uses "!" to indicate a falsey statement
{
  type: 'container',
  visible: '!toggle',
  cssClasses: 'border',
  content: [
    {
      type: 'html',
      html: 'Container content type reversed',
    },
  ],
},
{
  type: 'row',
  visible: 'toggle',
  cssClasses: 'border',
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
  type: 'row',
  columns: [
    {
      type: 'column',
      visible: 'toggle',
      cssClasses: 'border',
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
      width: 6,
      cssClasses: 'border',
      content: [
        {
          type: 'html',
          html: 'Column content type not hidable',
        },
      ],
    },
  ],
},
`;
  public visiblityCode2 = `
  // Source toggle value
    {
      type: 'formField',
      formFieldType: 'text',
      label: 'Toggle Content',
      field: 'toggle2',
      hint: 'Enter a number over 5 to toggle visibility',
    },
    {
      type: 'html',
      html: 'No number has been entered',
      cssClasses: 'border',
      visible: '!toggle2',
    },
    // Greater than
    {
      type: 'html',
      html: 'The number is greater than 5',
      cssClasses: 'border',
      visible: {
        field: 'toggle2',
        operator: 'gt',
        value: 5,
      },
    },
    // Less than
    {
      type: 'html',
      html: 'The number is less than 5',
      cssClasses: 'border',
      visible: {
        field: 'toggle2',
        operator: 'lt',
        value: 5,
      },
    },
    `;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
