"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DelayFrame = void 0;
const frame_1 = require("./frame");
class DelayFrame extends frame_1.Frame {
    constructor(duration) {
        super(duration);
        this.duration = duration;
        this.type = frame_1.FrameType.DelayFrame;
        this.toBytes = () => {
            const size = this.size;
            let dataPointer = 0;
            const data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = this.type;
            /// frame duration (little endian)
            data[dataPointer++] = this.duration & 255;
            data[dataPointer++] = this.duration >>> 8;
            return data;
        };
    }
    /// [(1)type][(2)duration]
    get size() {
        const headerSize = 1;
        const durationSize = 2;
        return headerSize + durationSize;
    }
}
exports.DelayFrame = DelayFrame;
