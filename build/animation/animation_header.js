import { NULL_CHAR, NULL_CHAR_SIZE_IN_BYTES, UINT_16_MAX_SIZE, UINT_16_SIZE_IN_BYTES, UINT_8_MAX_SIZE, UINT_8_SIZE_IN_BYTES, } from "../utils/sizes";
export const NEWEST_ANIMATION_VERSION = 1;
export const MIN_ANIMATION_VERSION = 1;
export class AnimationHeader {
    constructor({ xCount, yCount, versionNumber: version, name, loopsCount: loops, }) {
        this._getEncodedAnimationNameV2 = () => {
            const isBrowser = typeof window != "undefined";
            const isLittleEndian = AnimationHeader.isLittleEndian;
            const size = this.size;
            console.log(`Encoding header: little_endian=${isLittleEndian}, size=${size}bytes`);
            let offset = 0;
            const bytes = new Uint8Array(size);
            const dataView = new DataView(bytes.buffer);
            console.log(`Allocating header bytes → [${bytes}].`);
            console.log(`Writing version number: "${this.versionNumber}".`);
            dataView.setUint16(offset, this.versionNumber, isLittleEndian);
            offset += UINT_16_SIZE_IN_BYTES;
            console.log(`Version number has been written → [${bytes}].`);
            const encoder = isBrowser
                ? new TextEncoder()
                : (() => new (require("util").TextEncoder)())();
            console.log(`Encoding name: "${this.name}".`);
            const encodedName = encoder.encode(this.name);
            console.log(`Name encoded: "${encodedName}".`);
            bytes.set(encodedName, offset);
            offset += encodedName.length;
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
        this.encode = () => {
            return this._getEncodedAnimationNameV2();
        };
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
        if (version !== undefined &&
            (version < MIN_ANIMATION_VERSION || version > NEWEST_ANIMATION_VERSION)) {
            throw new Error("Unsupported version provided. " +
                "Supported versions are in between: " +
                `"${MIN_ANIMATION_VERSION}" and "${NEWEST_ANIMATION_VERSION}".`);
        }
        this.versionNumber = version !== null && version !== void 0 ? version : NEWEST_ANIMATION_VERSION;
        if (!name) {
            throw new Error("Animation name is required.");
        }
        this.name = name;
        if (loops !== undefined && isNaN(loops)) {
            throw new Error(`Value of "loops" must be a number.`);
        }
        if (loops !== undefined && (loops < 0 || loops > UINT_16_MAX_SIZE)) {
            throw new Error(`Unsupported loops count provided. ` +
                `Currently supported loops count is between "0" (for infinite/device maximum loops) and ${UINT_16_MAX_SIZE}.`);
        }
        this.loopsCount = Math.floor(loops !== null && loops !== void 0 ? loops : 1);
    }
    get pixelsCount() {
        return this.xCount * this.yCount;
    }
    get ledsCount() {
        return this.xCount * this.yCount;
    }
    get size() {
        /// NULL CHAR IS USED AS THE SEPARATOR
        const isBrowser = typeof window != "undefined";
        const encoder = isBrowser
            ? new TextEncoder()
            : (() => new (require("util").TextEncoder)())();
        const versionSize = UINT_16_SIZE_IN_BYTES;
        const animationNameSize = encoder.encode(this.name).length + NULL_CHAR_SIZE_IN_BYTES;
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
}
AnimationHeader.isLittleEndian = true;
AnimationHeader.decode = (buffer) => {
    const isBrowser = typeof window != "undefined";
    let offset = 0;
    const bytes = new Uint8Array(buffer);
    const dataView = new DataView(bytes.buffer);
    const versionNumber = dataView.getUint16(offset, AnimationHeader.isLittleEndian);
    offset += UINT_16_SIZE_IN_BYTES;
    const nameEndIndex = buffer.indexOf(NULL_CHAR, offset);
    const nameBuffer = buffer.slice(offset, nameEndIndex);
    const name = (isBrowser
        ? new TextDecoder()
        : (() => new (require("util").TextDecoder)())()).decode(nameBuffer);
    offset = nameEndIndex + NULL_CHAR_SIZE_IN_BYTES;
    const xCount = dataView.getUint8(offset++);
    const yCount = dataView.getUint8(offset++);
    const loopsCount = dataView.getUint16(offset, AnimationHeader.isLittleEndian);
    console.log("loopsCount", loopsCount);
    offset += UINT_16_SIZE_IN_BYTES;
    return {
        header: new AnimationHeader({
            xCount,
            yCount,
            name,
            loopsCount,
            versionNumber,
        }),
        data: bytes.slice(offset),
    };
};
