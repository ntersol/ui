import { Component, EventEmitter, Input, OnInit, Output, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fromNullable, getOrElse, mapNullable } from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/pipeable';
import { toArray } from '../../utils';

/**
   * DataField Type
   * 
    value?: string;
    guid?: string;
    panelGuid?: string;
    isNoteToAgent?: boolean;
    text?: string;
    isNewLine?: boolean;
    addNote?: string;
    dataFieldGuid?: string;
    dataFieldName?: string;
    dataFieldRequired?: boolean;
    dataFieldIsRO?: boolean;
   */

@Component({
  selector: 'nts-panel',
  templateUrl: './panel.component.html',
  styleUrls: [`panel.component.scss`],
})
export class PanelComponent implements OnInit, OnChanges {
  @Input() panel: NtsScripter.PanelWithContent = {};
  @Input() dataFields: Record<string, NtsScripter.DataField[]> = {};
  @Input() formGroup = new FormGroup({});
  @Input() dispositions: NtsScripter.Disposition[] = [];

  @Output() disposition = new EventEmitter<NtsScripter.Disposition>();
  @Output() buttonClick = new EventEmitter<NtsScripter.PanelButton>();
  @Output() panelEdit = new EventEmitter<string>();
  @Output() edit = new EventEmitter<Record<string, string>>();
  @Output() formChanged = new EventEmitter<null>();

  readonly toArray = toArray;
  readonly findDataField = (d: { dataFieldGuid: string; dataFields: NtsScripter.DataField[] }) =>
    d.dataFields.find(df => df.guid === d.dataFieldGuid);
  readonly toButtonText = (ds: NtsScripter.Disposition[]) => (button: NtsScripter.PanelButton) => {
    if (button.isWarmTransferBtn) {
      return 'Consult Banker';
    } else if (button.goToPanelText) {
      return button.goToPanelText;
    } else if (button.dispositionBtn) {
      return pipe(
        fromNullable(button.dispositionBtn),
        mapNullable(code => ds.find(d => d.code === code)),
        mapNullable(d => d.displayName),
        getOrElse(() => 'Unknown Disposition'),
      );
    } else {
      return 'Unknown Button';
    }
  };

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    // console.log(this.panel.name, this);
  }
}
