declare namespace NtsTable {
  type ColumnType = 'email' | 'phoneNumber' | 'date' | 'dateTime' | 'currency' | 'limited';
  interface Column {
    field: string;
    header: string | null;
    type?: ColumnType;
    /** Arguments to pass to the formatting pipes */
    typeArgs?: string;
  }
}
