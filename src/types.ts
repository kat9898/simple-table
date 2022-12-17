
export type Row = {
  id: string,
  status: string, // {‘active’, ‘archive’}
  sum: number,
  qty: number,
  volume: number,
  name: string,
  delivery_date: string,
  currency: string,
  total?: number
}

export type IColumsNames = {
  header: string,
  accessor: string
}

export type SortOrder = 'up' | 'down';

export interface CheckedInterface {
      [key: number]: true | false
  }