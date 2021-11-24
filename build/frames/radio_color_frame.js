"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioColorFrame = void 0;
const __1 = require("..");
const frame_1 = require("./frame");
class RadioColorFrame extends frame_1.Frame {
    constructor(panelIndex, color, duration) {
        super(duration);
        this.panelIndex = panelIndex;
        this.color = color;
        this.duration = duration;
        this.type = frame_1.FrameType.RadioColorFrame;
        this.toBytes = () => {
            const size = this.size;
            let dataPointer = 0;
            const data = new Uint8Array(size);
            /// frame type
            data[dataPointer++] = this.type;
            /// frame duration (little endian)
            data[dataPointer++] = this.duration & 255;
            data[dataPointer++] = this.duration >>> 8;
            /// panel index
            data[dataPointer++] = this.panelIndex;
            /// color
            data[dataPointer++] = this.color.red;
            data[dataPointer++] = this.color.green;
            data[dataPointer++] = this.color.blue;
            return data;
        };
        /// Copy visual frame instance
        this.copy = () => new RadioColorFrame(this.panelIndex, this.color, this.duration);
        this.copyWith = ({ duration, color, panelIndex, } = {}) => new RadioColorFrame(panelIndex !== null && panelIndex !== void 0 ? panelIndex : this.panelIndex, color !== null && color !== void 0 ? color : this.color, duration !== null && duration !== void 0 ? duration : this.duration);
    }
    /// [(uint8)type][(uint16)duration][(uint8)panelIndex][(uint8)red][(uint8)green][(uint8)blue]
    get size() {
        const frameType = __1.UINT_8_SIZE_IN_BYTES;
        const durationSize = __1.UINT_16_SIZE_IN_BYTES;
        const panelIndex = __1.UINT_8_SIZE_IN_BYTES;
        const red = __1.UINT_8_SIZE_IN_BYTES;
        const green = __1.UINT_8_SIZE_IN_BYTES;
        const blue = __1.UINT_8_SIZE_IN_BYTES;
        return frameType + durationSize + panelIndex + red + green + blue;
    }
}
exports.RadioColorFrame = RadioColorFrame;
