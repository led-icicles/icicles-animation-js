export const isAscii = (str) => /^[\x00-\x7F]*$/.test(str);
export const getNonAscii = (str) => str.matchAll(/[^\x00-\x7F]/g);
