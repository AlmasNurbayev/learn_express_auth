import {
  PgSelect,
  PgTableWithColumns,
  TableConfig,
  getTableConfig,
} from 'drizzle-orm/pg-core';
import { constants } from '../constants';
import { asc, desc } from 'drizzle-orm';

export function AddPagination<T extends PgSelect>(
  limit: string | undefined,
  offset: string | undefined,
  order: string | undefined,
  table: PgTableWithColumns<TableConfig>,
  qb: T,
) {
  console.log(typeof limit);

  let limitNumber, offsetNumber;

  if (!limit) {
    limitNumber = constants.default_limit;
  } else {
    limitNumber = Number(limit);
  }
  if (!offset) {
    offsetNumber = constants.default_offset;
  } else {
    offsetNumber = Number(offset);
  }
  if (order) {
    if (typeof order === 'string') {
      order = JSON.parse(order);
    }
    if (typeof order === 'object') {
      const orderArray = [];
      for (const key in order) {
        const column = getTableConfig(table).columns.find((c) => c.name === key);
        //console.log(key, order[key], column);
        if (column !== undefined) {
          console.log(order[key], column.name);
          orderArray.push(String(order[key]) === 'asc' ? asc(column) : desc(column));
        }
      }
      qb.orderBy(...orderArray);
    }
  }

  return qb.limit(limitNumber).offset(offsetNumber);
}
