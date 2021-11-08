import { Frame, FrameType } from "./frame";
export default class DelayFrame extends Frame {
    constructor(duration) {
        super(duration);
        this.duration = duration;
        this.type = FrameType.DelayFrame;
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
//# sourceMappingURL=delay_frame.js.map