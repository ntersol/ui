import { ColDef } from 'ag-grid-community';

// Filter options : agTextColumnFilter | agNumberColumnFilter | agDateColumnFilter

export const columns: ColDef[] = [
  {
    field: 'name',
    headerName: 'Name',
    enableRowGroup: true,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'username',
    headerName: 'Username',
    enableRowGroup: true,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'email',
    headerName: 'Email',
    enableRowGroup: true,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'phone',
    headerName: 'Phone',
    enableRowGroup: true,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'website',
    headerName: 'Website',
    enableRowGroup: true,
    filter: 'agTextColumnFilter',
  },
  {
    field: 'delete',
    headerName: 'Delete User',
    enableRowGroup: true,
  },
];
