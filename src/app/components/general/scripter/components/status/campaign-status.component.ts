import { Component, Input, OnInit } from '@angular/core';
import { fromNullable, getOrElse, mapNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { toArray, isNotNil } from '../../utils';

@Component({
  selector: 'nts-campaign-status',
  template: `
    <p-toolbar class="mb-3">
      <div
        *ngIf="call?.call?.dataItems | map: keyByName as data"
        class="ui-toolbar-group-left fld-col fld-sm-row flg-4 cfr-b0"
      >
        <span>
          <strong>Borrower Name:</strong>
          <span>
            {{ data['is_attr_FirstName']?.valueText || 'Unknown' }}
            {{ data['is_attr_LastName']?.valueText || 'Lead' }}
          </span>
        </span>

        <span>
          <strong>Lead Source:</strong>
          <span>
            {{ data['is_attr_LeadType']?.valueText || 'Unknown Source' }}
          </span>
        </span>

        <span>
          <strong>Type:</strong>
          <span>
            {{ data['is_attr_CampaignType']?.valueText || 'Unknown' }}
          </span>
        </span>

        <span>
          <strong>Campaign:</strong>
          <span>
            {{ call.campaign?.name || 'Unknown Campaign' }}
          </span>
        </span>
      </div>

      <div class="ui-toolbar-group-right cfr-b0">
        <strong>Call Duration:</strong>
        <nts-timer [timerId]="call | map: toCallGuid"></nts-timer>
      </div>
    </p-toolbar>
  `,
  styles: [``],
})
export class CampaignStatusComponent implements OnInit {
  @Input()
  call: NtsScripter.NewCallResponse = {};

  readonly keyByName = (dataItems: NtsScripter.CallDataItem[] | null | undefined) =>
    toArray(dataItems).reduce(
      (acc, item) => (isNotNil(item.name) ? Object.assign(acc, { [item.name]: item }) : acc),
      {} as Record<string, NtsScripter.CallDataItem>,
    );
  readonly toCallGuid = (callResponse: NtsScripter.NewCallResponse) =>
    pipe(
      fromNullable(callResponse.call),
      mapNullable(c => c.guid),
      getOrElse(() => 'global'),
    );

  constructor() {}

  ngOnInit(): void {}
}
