"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdditiveFrameRgb565 = void 0;
const _1 = require(".");
const frame_1 = require("./frame");
class AdditiveFrameRgb565 extends _1.AdditiveFrame {
    constructor() {
        super(...arguments);
        this.type = frame_1.FrameType.AdditiveFrameRgb565;
        this.toBytes = () => {
            const size = this.size;
            let dataPointer = 0;
            const data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = this.type;
            /// frame duration (little endian)
            data[dataPointer++] = this.duration & 255;
            data[dataPointer++] = this.duration >>> 8;
            /// frame size (little endian)
            const changedPixelsCount = this.changedPixels.length;
            data[dataPointer++] = changedPixelsCount & 255;
            data[dataPointer++] = changedPixelsCount >>> 8;
            /// frame pixels
            for (let i = 0; i < this.changedPixels.length; i++) {
                const changedPixel = this.changedPixels[i];
                const index = changedPixel.index;
                /// pixel index (little endian)
                data[dataPointer++] = index & 255;
                data[dataPointer++] = index >>> 8;
                const color565 = changedPixel.toRgb565();
                /// color 565 (little endian)
                data[dataPointer++] = color565 & 255;
                data[dataPointer++] = color565 >>> 8;
            }
            return data;
        };
    }
    // [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)size][(x * 5)changedPixels]
    get size() {
        const typeSize = 1;
        const durationSize = 2;
        const sizeFieldSize = 2;
        const changedPixelsSize = this.changedPixels.length * 4;
        return typeSize + durationSize + sizeFieldSize + changedPixelsSize;
    }
    static fromAdditiveFrame(frame) {
        return new AdditiveFrameRgb565(frame.changedPixels.slice(0), frame.duration);
    }
}
exports.AdditiveFrameRgb565 = AdditiveFrameRgb565;
