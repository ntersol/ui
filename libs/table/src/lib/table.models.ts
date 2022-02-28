export namespace NtsTable {
  export type ColumnType = 'email' | 'phoneNumber' | 'date' | 'dateTime' | 'currency' | 'limited';
  export interface Column<t = any> {
    field: keyof t | string;
    header: string | null;
    type?: ColumnType;
    /** Arguments to pass to the formatting pipes */
    typeArgs?: string;
    sortable?: boolean;
    width?: string;
    style?: Record<string, string>;
  }
}
