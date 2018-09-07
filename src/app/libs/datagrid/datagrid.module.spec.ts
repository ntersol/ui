import { DatagridModule } from './datagrid.module';

describe('DatagridModule', () => {
  let datagridModule: DatagridModule;

  beforeEach(() => {
    datagridModule = new DatagridModule();
  });

  it('should create an instance', () => {
    expect(datagridModule).toBeTruthy();
  });
});
