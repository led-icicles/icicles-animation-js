import { TextEncoder } from "util";
import { getNonAscii, isAscii } from "../utils/regex";
import { UINT_16_MAX_SIZE, UINT_8_MAX_SIZE } from "../utils/sizes";

export const NEWEST_ANIMATION_VERSION: number = 1;
export const MIN_ANIMATION_VERSION: number = 1;

export interface AnimationHeaderData {
  readonly name: string;
  readonly xCount: number;
  readonly yCount: number;
  readonly loops?: number;
  readonly version?: number;
}

export class AnimationHeader implements AnimationHeaderData {
  /**  **uint16** max number: `65535` */
  readonly version: number;
  readonly name: string;
  /**  **uint8** max number: `255` */
  readonly xCount: number;
  /**  **uint8** max number: `255` */
  readonly yCount: number;
  /**  **uint16** max number: `65535`
   * 0 - infinite (or device maximum loop iterations - if defined)
   * 1 - is a default value
   */
  readonly loops: number;

  constructor({ xCount, yCount, version, name, loops }: AnimationHeaderData) {
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
    this.version = version ?? NEWEST_ANIMATION_VERSION;

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

    this.loops = Math.ceil(loops ?? 1);
  }

  public get ledsCount(): number {
    return this.xCount * this.yCount;
  }

  public get size(): number {
    /// NULL CHAR IS USED AS THE SEPARATOR
    const NULL_CHAR_BYTE_COUNT = 1;

    const animationNameSize = this.name.length + NULL_CHAR_BYTE_COUNT;

    return animationNameSize;
  }

  private _getEncodedAnimationNameV1 = (): Uint8Array => {
    const encoder = new TextEncoder();
    const encodedName = encoder.encode(this.name);
    const encodednNameWithNullChar = new Uint8Array(encodedName.length + 1);
    encodednNameWithNullChar.set(encodedName);
    const NULL_CHAR = 0;
    encodednNameWithNullChar[encodedName.length] = NULL_CHAR;
    return encodednNameWithNullChar;
  };

  private _getEncodedAnimationNameV2 = (): Uint8Array => {
    throw new Error("Unimplemented.");
  };

  public encode = (): Uint8Array => {
    switch (this.version) {
      case 1:
        return this._getEncodedAnimationNameV1();
      case 2:
        return this._getEncodedAnimationNameV2();
      default:
        throw new Error(`Unsupported animation version: ${this.version}`);
    }
  };
}
