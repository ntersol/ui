import { Component, OnInit } from '@angular/core';
import { HighlightService } from '../../../home/shared/services/highlight.service';

@Component({
  selector: 'nts-formgroup2-api',
  templateUrl: './formgroup2-api.component.html',
  styleUrls: ['./formgroup2-api.component.css']
})
export class Formgroup2ApiComponent implements OnInit {

  public structure = `
  {
    loanApplication: {
      borrowers: [
        {
          address: {},
          incomes: [{}],
          assets: [{}],
          liabilities: [{}]
        }
      ]
    }
  }`;

  public api = ``;
  public exampleTS = `
// Import interface
import { FormGroup2ApiModel } from '@ntersol/utils';

// Prepend slug for api url
const apiBase = environment.endpoints.apiUrl;

// Main model
export const formGroupModel: FormGroup2ApiModel[] = [
  {
    path: 'loanApplication',
    uniqueID: 'guid',
    ignoreProps: ['borrowers', 'property'],
    apiUrl: apiBase + '/loanapplications',
  },
  {
    path: 'loanApplication.borrowers',
    uniqueID: 'guid',
    parent: {
      uniqueID: 'guid',
      parentID: 'loanApplicationGUID',
    },
    apiUrl: (parent: any) => apiBase + '/loanapplications/' + parent[0]?.loanApplicationGUID + '/borrowers',
    apiUrls: {
      patch: apiBase + '/borrowers',
    },
    ignoreProps: [
      'assets',
      'address',
      'liabilities',
      'incomes',
    ],
  },
  {
    path: 'loanApplication.borrowers.assets',
    uniqueID: 'guid',
    parent: {
      uniqueID: 'guid',
      parentID: 'borrowerGUID',
    },
    apiUrls: {
      patch: apiBase + '/assets',
      delete: apiBase + '/assets',
    },
    apiUrl: (parent: any) => apiBase + '/borrowers/' + parent.guid + '/assets',
  },
];
`
  public exampleTS2 = `
// Import save method
import { saveFormGroup$ } from '@ntersol/utils';

// Perform save
saveFormGroup$(this.http, formGroupModel, formGroup).subscribe(() => {
  // Do something when all api calls complete successfully
})
`;

  public exampleTS3 = `
// Import util from forms library
import { jsonToFormGroup } from '@ntersol/forms';

// Generate form group from JSON input
public formGroup = jsonToFormGroup({
  loanApplication: {
    borrowers: [
      {
        address: {},
        incomes: [{}],
        assets: [{}],
        liabilities: [{}]
      }
    ]
  }
})

// Alternative you can create it the hard way using form builder:
// Import form builder
import { FormBuilder } from '@angular/forms';

// Inject into constructor
constructor(private fb: FormBuilder) {}

// Create form group
public formGroup = this.fb.group({
  loanApplication: this.fb.group({
    borrowers: this.fb.array({
      ...
    })
  })
})
`;

  constructor(private highlight: HighlightService) { }

  ngOnInit(): void {

  }


  ngAfterViewInit() {
    this.highlight.highlightAll();
  }

}

