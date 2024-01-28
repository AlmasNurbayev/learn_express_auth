import { FormError } from './interfaces';

export function deleteUndefinedEmptyKeys<T>(obj: T) {
  for (const propName in obj) {
    if (obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj;
}

export function parseZodErrors(resultData: unknown) {
  const result = resultData as {
    data: { issues: { path: string[]; message: string }[] };
  };
  const errors: FormError[] = [];

  result?.data?.issues?.map((item) => {
    item.path.map((pathItem) => {
      errors.push({
        field: pathItem,
        error: item.message,
      });
    });
  });
  return errors;
}
