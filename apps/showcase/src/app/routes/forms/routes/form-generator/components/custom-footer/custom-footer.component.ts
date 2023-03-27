import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { NtsForms } from 'libs/forms/src/lib/forms.model';
import { HighlightService } from '../../../../../../shared/services/highlight.service';
import { userModel } from '../../form.model';

@Component({
  selector: 'nts-custom-footer',
  templateUrl: './custom-footer.component.html',
  styleUrls: ['./custom-footer.component.scss'],
})
export class CustomFooterComponent implements OnInit {
  public formGroup = this.fb.group(userModel);

  public formModel: NtsForms.FormGenerator = [
    {
      type: 'formField',
      formFieldType: 'text',
      label: 'First Name',
      field: 'nameFirst',
    },
  ];

  public layoutCode = this.higlight.htmlEncode(`
  <!-- Custom content before and after the submit button -->
  <nts-form-generator [formModel]="formModel" [formGroup]="formGroup">
    <div beforeSubmitButton><button pButton class="mr-2">Before Submit</button></div>
    <div afterSubmitButton><button pButton class="ml-2">After Submit</button></div>
  </nts-form-generator>

  <!-- Custom content for left and right side of footer -->
  <nts-form-generator [formModel]="formModel" [formGroup]="formGroup">
    <div footerContentLeft>
      <button pButton>Undo Changes</button>
    </div>
    <div footerContentRight>
      <button pButton>Custom Submit</button>
      </div>
  </nts-form-generator>
  `);
  constructor(private higlight: HighlightService, private fb: FormBuilder) {}

  ngOnInit(): void {}
}
