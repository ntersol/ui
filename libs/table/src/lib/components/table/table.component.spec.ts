import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TableComponent } from './table.component';
import { NtsTableModule } from '../../table.module';
import { ngMocks } from 'ng-mocks';
import {
  ChangeDetectionStrategy,
  DebugElement,
  // ChangeDetectorRef
} from '@angular/core';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  // let cdRef: ChangeDetectorRef;

  ngMocks.faster();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableComponent
      ],
      imports: [
        NtsTableModule
      ]
    })
      // Method to avoid using cdRef to force CD for testing
      .overrideComponent(TableComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default }
      })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    // cdRef = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef);
    // cdRef.detectChanges();

    // TODO: Figure out why headerText has to be set here, to allow later tests to work...
    // component.headerText = 'Test';

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show table header', () => {
    component.headerText = 'Test Header Text';

    fixture.detectChanges();

    const tableElement: DebugElement = fixture.debugElement;
    const tableHeader = tableElement.query(By.css('.p-datatable-header'));

    expect(tableHeader.nativeElement.textContent).toContain('Test Header Text');
  });

  it('should show column header', () => {
    component.columns = [
      {
        field: 'testcol1',
        header: 'Test Column 1'
      }
    ];
    component.rows = [
      { testcol1: 'Test Row Cell 1' }
    ];

    fixture.detectChanges();

    const tableElement: DebugElement = fixture.debugElement;
    const tableHeaderCol = tableElement.query(By.css('th'));

    expect(tableHeaderCol.nativeElement.textContent).toContain('Test Column 1');
  });

  it('should show/hide row expansion column', () => {
    component.columns = [
      {
        field: 'testcol1',
        header: 'Test Column 1'
      }
    ];
    component.rows = [
      { testcol1: 'Test Row Cell 1' }
    ];
    component.shouldShowExpandRow = true;

    fixture.detectChanges();

    let tableElement: DebugElement = fixture.debugElement;
    let thColumns = tableElement.queryAll(By.css('th'));

    expect(thColumns.length).toEqual(2);

    component.shouldShowExpandRow = false;

    fixture.detectChanges();

    tableElement = fixture.debugElement;
    thColumns = tableElement.queryAll(By.css('th'));

    expect(thColumns.length).toEqual(1);
  });
});
