export const isAscii = (str: string) => /^[\x00-\x7F]*$/.test(str);
export const getNonAscii = (str: string): IterableIterator<RegExpMatchArray> =>
  str.matchAll(/[^\x00-\x7F]/g);
