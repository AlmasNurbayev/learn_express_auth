export function deleteUndefinedEmptyKeys<T>(obj: T) {
  for (const propName in obj) {
    if (obj[propName] === undefined || obj[propName] === '') {
      delete obj[propName];
    }
  }
  return obj;
}