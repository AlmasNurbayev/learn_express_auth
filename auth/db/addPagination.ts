import {
  PgSelect,
  PgTableWithColumns,
  TableConfig,
  getTableConfig,
} from 'drizzle-orm/pg-core';
import { asc, desc } from 'drizzle-orm';

export function AddPagination<T extends PgSelect>(
  limit: string | undefined,
  offset: string | undefined,
  order: string | undefined,
  table: PgTableWithColumns<TableConfig>,
  qb: T,
) {
  if (limit) {
    qb.limit(Number(limit));
  }
  if (offset) {
    qb.offset(Number(offset));
  }
  if (order) {
    if (typeof order === 'string') {
      order = JSON.parse(order);
    }
    if (typeof order === 'object') {
      const orderArray = [];
      for (const key in order as object) {
        const column = getTableConfig(table).columns.find((c) => c.name === key);
        if (column !== undefined) {
          orderArray.push(String(order[key]) === 'asc' ? asc(column) : desc(column));
        }
      }
      qb.orderBy(...orderArray);
    }
  }

  return qb;
}
