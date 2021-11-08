"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNonAscii = exports.isAscii = void 0;
const isAscii = (str) => /^[\x00-\x7F]*$/.test(str);
exports.isAscii = isAscii;
const getNonAscii = (str) => str.matchAll(/[^\x00-\x7F]/g);
exports.getNonAscii = getNonAscii;
