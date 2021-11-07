import { TextEncoder } from "util";
import { getNonAscii, isAscii } from "../utils/regex";
import {
  UINT_16_MAX_SIZE,
  UINT_16_SIZE_IN_BYTES,
  UINT_8_MAX_SIZE,
  UINT_8_SIZE_IN_BYTES,
} from "../utils/sizes";

export const NEWEST_ANIMATION_VERSION: number = 1;
export const MIN_ANIMATION_VERSION: number = 1;

export interface AnimationHeaderData {
  readonly name: string;
  readonly xCount: number;
  readonly yCount: number;
  readonly loopsCount?: number;
  readonly versionNumber?: number;
}

export class AnimationHeader implements AnimationHeaderData {
  /**  **uint16** max number: `65535` */
  readonly versionNumber: number;
  readonly name: string;
  /**  **uint8** max number: `255` */
  readonly xCount: number;
  /**  **uint8** max number: `255` */
  readonly yCount: number;
  /**  **uint16** max number: `65535`
   * 0 - infinite (or device maximum loop iterations - if defined)
   * 1 - is a default value
   */
  readonly loopsCount: number;

  constructor({
    xCount,
    yCount,
    versionNumber: version,
    name,
    loopsCount: loops,
  }: AnimationHeaderData) {
    if (isNaN(xCount)) {
      throw new Error("Value of xCount must be a number.");
    }
    if (isNaN(yCount)) {
      throw new Error("Value of yCount must be a number.");
    }
    if (xCount > UINT_8_MAX_SIZE) {
      throw new Error("Only 255 leds in X axis are supported.");
    }
    if (yCount > UINT_8_MAX_SIZE) {
      throw new Error("Only 255 leds in Y axis are supported.");
    }
    if (xCount <= 0) {
      throw new Error("At least 1 led is required for X axis.");
    }
    if (yCount <= 0) {
      throw new Error("At least 1 led is required for Y axis.");
    }
    this.xCount = xCount;
    this.yCount = yCount;

    if (
      version !== undefined &&
      (version < MIN_ANIMATION_VERSION || version > NEWEST_ANIMATION_VERSION)
    ) {
      throw new Error(
        "Unsupported version provided. " +
          "Supported versions are in between: " +
          `"${MIN_ANIMATION_VERSION}" and "${NEWEST_ANIMATION_VERSION}".`
      );
    }
    this.versionNumber = version ?? NEWEST_ANIMATION_VERSION;

    if (!name) {
      throw new Error("Animation name is required.");
    }
    if (!isAscii(name)) {
      throw new Error(
        `Value of "name" can contain only ascii characters. ` +
          `Unsupported characters: ${getNonAscii(name)}.`
      );
    }
    this.name = name;

    if (loops !== undefined && isNaN(loops)) {
      throw new Error(`Value of "loops" must be a number.`);
    }

    if (loops !== undefined && (loops < 0 || loops > UINT_16_MAX_SIZE)) {
      throw new Error(
        `Unsupported loops count provided. ` +
          `Currently supported loops count is between "0" (for infinite/device maximum loops) and ${UINT_16_MAX_SIZE}.`
      );
    }

    this.loopsCount = Math.ceil(loops ?? 1);
  }

  public get ledsCount(): number {
    return this.xCount * this.yCount;
  }

  public get size(): number {
    /// NULL CHAR IS USED AS THE SEPARATOR
    const NULL_CHAR_BYTE_COUNT = 1;

    const versionSize = UINT_16_SIZE_IN_BYTES;
    const animationNameSize = this.name.length + NULL_CHAR_BYTE_COUNT;
    const xCountSize = UINT_8_SIZE_IN_BYTES;
    const yCountSize = UINT_8_SIZE_IN_BYTES;
    const loopsSize = UINT_16_SIZE_IN_BYTES;

    return [
      versionSize,
      animationNameSize,
      xCountSize,
      yCountSize,
      loopsSize,
    ].reduce((a, b) => a + b, 0);
  }

  readonly isLittleEndian: boolean = true;

  private _getEncodedAnimationNameV2 = (): Uint8Array => {
    const isLittleEndian = this.isLittleEndian;

    const size = this.size;

    console.log(
      `Encoding header: little_endian=${isLittleEndian}, size=${size}bytes`
    );

    let offset = 0;

    const bytes = new Uint8Array(size);
    const dataView = new DataView(bytes.buffer);
    console.log(`Allocating header bytes → [${bytes}].`);

    console.log(`Writing version number: "${this.versionNumber}".`);
    dataView.setUint16(offset, this.versionNumber, isLittleEndian);
    offset += UINT_16_SIZE_IN_BYTES;
    console.log(`Version number has been written → [${bytes}].`);

    const encoder = new TextEncoder();
    console.log(`Encoding name: "${this.name}".`);
    const encodedName = encoder.encode(this.name);
    console.log(`Name encoded: "${encodedName}".`);
    bytes.set(encodedName, offset);
    offset += encodedName.length;

    const NULL_CHAR = 0;
    bytes[offset++] = NULL_CHAR;
    console.log(`Name has been written → [${bytes}].`);
    console.log(`Encoding xCount: "${this.xCount}".`);
    dataView.setUint8(offset++, this.xCount);
    console.log(`xCount has been written → [${bytes}].`);
    console.log(`Encoding yCount: "${this.yCount}".`);
    dataView.setUint8(offset++, this.yCount);
    console.log(`yCount has been written → [${bytes}].`);
    console.log(`Encoding loopsCount: "${this.loopsCount}".`);
    dataView.setUint16(offset, this.loopsCount, isLittleEndian);
    offset += UINT_16_SIZE_IN_BYTES;
    console.log(`loopsCount has been written → [${bytes}].`);

    console.log(`Animation file header encoded → [${bytes}].`);
    return bytes;
  };

  public encode = (): Uint8Array => {
    return this._getEncodedAnimationNameV2();
  };
}
