"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisualFrame = void 0;
const color_1 = require("../utils/color");
const frame_1 = require("./frame");
class VisualFrame extends frame_1.Frame {
    constructor(pixels, duration) {
        super(duration);
        this.pixels = pixels;
        this.duration = duration;
        this.type = frame_1.FrameType.VisualFrame;
        /// Copy visual frame instance
        this.copy = () => new VisualFrame(this.pixels.slice(0), this.duration);
        this.copyWith = ({ duration, pixels, } = {}) => new VisualFrame(pixels !== null && pixels !== void 0 ? pixels : this.pixels.slice(0), duration !== null && duration !== void 0 ? duration : this.duration);
        this.darken = (progress, duration) => {
            const pixels = this.pixels.map((color) => color.darken(progress));
            return new VisualFrame(pixels, duration !== null && duration !== void 0 ? duration : this.duration);
        };
        this.toBytes = ({ rgb565 = false, } = {}) => {
            const size = rgb565 ? this.size565 : this.size;
            let dataPointer = 0;
            const data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = rgb565 ? frame_1.FrameType.AdditiveFrameRgb565 : this.type;
            /// frame duration (little endian)
            data[dataPointer++] = this.duration & 255;
            data[dataPointer++] = this.duration >>> 8;
            /// frame pixels
            for (let i = 0; i < this.pixels.length; i++) {
                if (rgb565) {
                    const color565 = this.pixels[i].toRgb565();
                    /// color 565 (little endian)
                    data[dataPointer++] = color565 & 255;
                    data[dataPointer++] = color565 >>> 8;
                }
                else {
                    data[dataPointer++] = this.pixels[i].red;
                    data[dataPointer++] = this.pixels[i].green;
                    data[dataPointer++] = this.pixels[i].blue;
                }
            }
            return data;
        };
    }
    static filled(pixels, color, duration) {
        return new VisualFrame(new Array(pixels).fill(color), duration);
    }
    /// [(1)type][(2)duration][(ledsCount*3)pixels]
    get size() {
        const typeSize = 1;
        const durationSize = 2;
        const colorsSize = this.pixels.length * 3;
        return typeSize + durationSize + colorsSize;
    }
    /// [(1)type][(2)duration][(ledsCount*2)pixels]
    get size565() {
        const typeSize = 1;
        const durationSize = 2;
        const colorsSize = this.pixels.length * 3;
        return typeSize + durationSize + colorsSize;
    }
}
exports.VisualFrame = VisualFrame;
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
    const pixels = from.pixels.map((color, index) => color_1.Color.linearBlend(color, to.pixels[index], progress));
    return new VisualFrame(pixels, duration !== null && duration !== void 0 ? duration : to.duration);
};
