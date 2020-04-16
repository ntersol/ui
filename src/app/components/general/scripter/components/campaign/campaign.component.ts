import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

export type DispositionEmit = {
  disposition: ICWS.Disposition;
  call: NtsScripter.NewCallResponse;
  panel: NtsScripter.PanelWithContent;
  items: Record<string, string>;
};

export type ButtonClickEmit = {
  button: NtsScripter.PanelButton;
  call: NtsScripter.NewCallResponse;
  panel: NtsScripter.PanelWithContent;
  items: Record<string, string>;
};

export type EditEmit = {
  data: Record<string, string>;
  call: NtsScripter.NewCallResponse;
  panel: NtsScripter.PanelWithContent;
  items: Record<string, string>;
};

export interface ScripterState {
  panelFlow: string[];
  panels: Record<string, NtsScripter.PanelWithContent>;
}

@Component({
  selector: 'nts-campaign',
  templateUrl: './campaign.component.html',
  styles: [``],
})
export class CampaignComponent implements OnInit, OnChanges, OnDestroy {
  @Input() call: NtsScripter.NewCallResponse = {};
  @Input() dataFields: Record<string, NtsScripter.DataField[]> = {};
  @Input() dispositions: NtsScripter.Disposition[] = [];

  @Output() disposition = new EventEmitter<DispositionEmit>();
  @Output() buttonClick = new EventEmitter<ButtonClickEmit>();
  @Output() edit = new EventEmitter<EditEmit>();
  @Output() savePrimaryNote = new EventEmitter<NtsScripter.CallNote>();
  @Output() addNewNote = new EventEmitter<NtsScripter.CallNote>();
  @Output() formChanged = new EventEmitter<any>();

  public state: ScripterState = {
    panelFlow: [],
    panels: {},
  };

  // TODO: Delete reference to this in html file
  public panel: any;

  public formGroup: FormGroup = new FormGroup({});

  constructor(private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.initialize(this.call);
  }

  ngOnChanges(model: SimpleChanges) {
    /**
    if (model.dataFields) {
      const dataFieldsRecord: Record<string, NtsScripter.DataField> = {};
      this.dataFields.forEach(d => (dataFieldsRecord[d.guid] = { ...d }));
      this.dataFieldsRecord = dataFieldsRecord;
    }
    */
    // If a new call
    if (model.call) {
      this.initialize(this.call);
    }
  }

  /**
   * Load initial scripter state
   * @param call
   */
  public initialize(call: Scripter.NewCallResponse) {
    if (!call) {
      return;
    }

    // Generate initial panel state
    this.state = {
      ...this.state,
      panelFlow:
        this.call.panelFlow && this.call.panelFlow.length
          ? this.call.panelFlow.map(p => p.panelGuid)
          : [this.call.panels[0].guid],
    };

    // Create record of panels for relational lookup
    if (this.call.panels) {
      const panels: Record<string, NtsScripter.PanelWithContent> = {};
      this.call.panels.forEach(p => (panels[p.guid] = { isOpen: false, ...p }));
      this.state.panels = panels;
    }

    // Create form group that contains the user data
    if (this.call && this.call.call.dataItems) {
      this.formGroup = new FormGroup({});
      this.call.call.dataItems.forEach(p =>
        this.formGroup.addControl(p.name, new FormControl(p.valueText || p.valueNumeric || p.valueInt || p.valueFixed)),
      );
    }
  }

  /**
   * Handle button clicks
   * @param button
   * @param call
   * @param panel
   * @param formGroup
   */
  public buttonClicked(
    button: NtsScripter.PanelButton,
    call: NtsScripter.NewCallResponse,
    panel: NtsScripter.PanelWithContent,
    formGroup: FormGroup,
  ) {
    // console.log('buttonClicked', button, panel);
    // If this is a routable button
    if (button && button.goToPanelGuid) {
      // Update panel flow
      const state: ScripterState = {
        ...this.state,
        panelFlow: [button.goToPanelGuid, ...this.state.panelFlow],
      };
      // Set all open panels to closed
      const panels = { ...state.panels };
      Object.keys(panels).forEach(key => (panels[key].isOpen = false));
      // Set first panel to open
      panels[state.panelFlow[0]].isOpen = true;
      this.state.panels = panels;
      this.state = state;
    }

    this.ref.markForCheck();
    this.buttonClick.emit({
      button: button,
      call: call,
      panel: panel,
      items: formGroup.value,
    });
  }

  /**
   * When a user clicks an edit panel button, reset the state to that panel
   * @param panelGuid
   */
  public panelEdit(panelGuid: string) {
    const state = { ...this.state };
    const panelFlow: string[] = [];
    // Loop through the current panel flow in reverse and keep adding panels until the current panel is hit
    // Add that one and stop
    for (let index = state.panelFlow.length - 1; index > 0; index--) {
      const element = state.panelFlow[index];
      if (element === panelGuid) {
        panelFlow.unshift(element);
        break;
      } else {
        panelFlow.unshift(element);
      }
    }
    // Set all open panels to closed
    const panels = { ...state.panels };
    Object.keys(panels).forEach(key => (panels[key].isOpen = false));
    // Set first panel to open
    panels[panelFlow[0]].isOpen = true;
    this.state = {
      ...state,
      panels: panels,
      panelFlow: panelFlow,
    };
    this.ref.markForCheck();
  }

  ngOnDestroy() {}
}
