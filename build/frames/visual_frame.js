import { Color } from "../color";
import { Frame, FrameType } from "./frame";
export class VisualFrame extends Frame {
    constructor(pixels, duration) {
        super(duration);
        this.pixels = pixels;
        this.duration = duration;
        this.type = FrameType.VisualFrame;
        /// Copy visual frame instance
        this.copy = () => new VisualFrame(this.pixels.slice(0), this.duration);
        this.copyWith = ({ duration, pixels, } = {}) => new VisualFrame(pixels !== null && pixels !== void 0 ? pixels : this.pixels.slice(0), duration !== null && duration !== void 0 ? duration : this.duration);
        this.darken = (progress, duration) => {
            const pixels = this.pixels.map((color) => color.darken(progress));
            return new VisualFrame(pixels, duration !== null && duration !== void 0 ? duration : this.duration);
        };
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
                data[dataPointer++] = this.pixels[i].red;
                data[dataPointer++] = this.pixels[i].green;
                data[dataPointer++] = this.pixels[i].blue;
            }
            return data;
        };
    }
    /// [(1)type][(2)duration][(ledsCount*3)pixels]
    get size() {
        const typeSize = 1;
        const durationSize = 2;
        const colorsSize = this.pixels.length * 3;
        return typeSize + durationSize + colorsSize;
    }
}
/// Verify wether two visual frames are compatibility
VisualFrame.assertVisualFramesCompatibility = (prevFrame, nextFrame) => {
    if (!(prevFrame instanceof VisualFrame) ||
        !(nextFrame instanceof VisualFrame)) {
        throw new Error("Bad frame type.");
    }
    else if (prevFrame.size !== nextFrame.size) {
        throw new Error("Frames cannot have different sizes.");
    }
};
VisualFrame.linearBlend = (from, to, progress, duration) => {
    VisualFrame.assertVisualFramesCompatibility(from, to);
    const pixels = from.pixels.map((color, index) => Color.linearBlend(color, to.pixels[index], progress));
    return new VisualFrame(pixels, duration !== null && duration !== void 0 ? duration : to.duration);
};
//# sourceMappingURL=visual_frame.js.map