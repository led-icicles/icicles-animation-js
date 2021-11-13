"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualFrameRgb565 = void 0;
const _1 = require(".");
const frame_1 = require("./frame");
class VisualFrameRgb565 extends _1.VisualFrame {
    constructor() {
        super(...arguments);
        this.type = frame_1.FrameType.VisualFrameRgb565;
        this.toBytes = () => {
            const size = this.size;
            let dataPointer = 0;
            const data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = this.type;
            /// frame duration (little endian)
            data[dataPointer++] = this.duration & 255;
            data[dataPointer++] = this.duration >>> 8;
            /// frame pixels
            for (let i = 0; i < this.pixels.length; i++) {
                const color565 = this.pixels[i].toRgb565();
                /// color 565 (little endian)
                data[dataPointer++] = color565 & 255;
                data[dataPointer++] = color565 >>> 8;
            }
            return data;
        };
    }
    /// [(1)type][(2)duration][(ledsCount*2)pixels]
    get size() {
        const typeSize = 1;
        const durationSize = 2;
        const colorsSize = this.pixels.length * 2;
        return typeSize + durationSize + colorsSize;
    }
    static fromVisualFrame(frame) {
        return new VisualFrameRgb565(frame.pixels.slice(0), frame.duration);
    }
}
exports.VisualFrameRgb565 = VisualFrameRgb565;
