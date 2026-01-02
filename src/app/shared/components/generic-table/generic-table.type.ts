export type Columns = {
  title: string;
  type: ColumnTypes;
  propertyValue: string;
};

export enum ColumnTypes {
  'TEXT',
  'MONEY',
  'BOOLEAN',
  'DATE',
}

export type Actions = {
  title: string;
  event: string;
  icon: string;
  isDisabled?: (data: any) => boolean;
};
