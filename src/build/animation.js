"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const animation_header_1 = require("./animation/animation_header");
const color_1 = __importStar(require("./color"));
const additive_frame_1 = __importDefault(require("./frames/additive_frame"));
const delay_frame_1 = __importDefault(require("./frames/delay_frame"));
const frame_1 = require("./frames/frame");
const visual_frame_1 = __importDefault(require("./frames/visual_frame"));
const sizes_1 = require("./utils/sizes");
class Animation {
    constructor(options) {
        this._frames = [];
        this.optimize = false;
        this.addFrame = (newFrame) => {
            if (!newFrame) {
                throw new Error("Frame was not provided.");
            }
            else if (newFrame instanceof delay_frame_1.default) {
                this._frames.push(newFrame);
                return;
            }
            else if (newFrame instanceof additive_frame_1.default) {
                this._frames.push(newFrame);
                return;
            }
            else if (!(newFrame instanceof visual_frame_1.default)) {
                throw new Error("Unsupported frame type.");
            }
            else if (newFrame.pixels.length !== this._header.ledsCount) {
                throw new Error(`Unsupported frame length. ` +
                    `Current: ${newFrame.pixels.length}, ` +
                    `required: ${this._header.ledsCount}`);
            }
            if (this.optimize) {
                const changedPixels = additive_frame_1.default.getChangedPixelsFromFrames(this.currentView, newFrame);
                const noPixelsChanges = changedPixels.length === 0;
                if (noPixelsChanges) {
                    /// TODO: We can then merge delay frames if possible.
                    this._frames.push(new delay_frame_1.default(newFrame.duration));
                }
                else {
                    const additiveFrame = new additive_frame_1.default(changedPixels, newFrame.duration);
                    const isAdditiveFrameSmaller = additiveFrame.size < newFrame.size;
                    if (isAdditiveFrameSmaller) {
                        this._frames.push(additiveFrame);
                    }
                    else {
                        this._frames.push(newFrame);
                    }
                }
            }
            else {
                this._frames.push(newFrame);
            }
            /// set current view
            this.currentView = newFrame;
        };
        this.toBytes = () => {
            if (this._frames.length === 0) {
                throw new Error("Animation is empty.");
            }
            const data = new Uint8Array(this.size);
            const encodedHeader = this._header.encode();
            const headerSize = encodedHeader.length;
            data.set(encodedHeader);
            let offset = headerSize;
            for (const frame of this._frames) {
                const frameBytes = frame.toBytes();
                const frameSize = frame.size;
                data.set(frameBytes, offset);
                offset += frameSize;
            }
            return data;
        };
        this.toFile = async (path) => {
            const isBrowser = typeof window !== "undefined";
            if (isBrowser) {
                throw new Error("This method is not supported in browser env");
            }
            const fs = require("fs");
            const stream = fs.createWriteStream(path, { encoding: "binary" });
            try {
                await new Promise((res, rej) => stream.write(this._header.encode(), (err) => {
                    if (err)
                        rej(err);
                    res();
                }));
                for (const frame of this._frames) {
                    const frameBytes = frame.toBytes();
                    await new Promise((res, rej) => stream.write(frameBytes, (err) => {
                        if (err)
                            rej(err);
                        res();
                    }));
                }
                stream.end();
            }
            catch (err) {
                stream.destroy();
                fs.unlinkSync(path);
                throw err;
            }
        };
        this._header = new animation_header_1.AnimationHeader({
            name: options.name,
            xCount: options.xCount,
            yCount: options.yCount,
            loopsCount: options.loopsCount,
            versionNumber: options.versionNumber,
        });
        /// Before each animation leds are set to black color.
        /// But black color is not displayed. To set all pixels to black,
        /// you should add frame, even [DelayFrame]
        this.currentView = new visual_frame_1.default(new Array(this._header.ledsCount).fill(new color_1.default(0, 0, 0)), 
        /// zero duration - this is just a placeholder
        0);
        if (options) {
            this.optimize = options.optimize ?? false;
        }
    }
    /// Animation size in bytes
    get size() {
        let framesDataSize = 0;
        for (let i = 0; i < this._frames.length; i++) {
            const frame = this._frames[i];
            framesDataSize += frame.size;
        }
        return this._header.size + framesDataSize;
    }
}
exports.default = Animation;
_a = Animation;
Animation.fromFile = async (path) => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
        throw new Error("This method is not supported in browser env");
    }
    const fs = require("fs");
    const buffer = await fs.promises.readFile(path);
    return Animation.decode(buffer);
};
Animation.decode = async (buffer) => {
    const { header, data } = animation_header_1.AnimationHeader.decode(buffer);
    console.log({ ...header });
    const animation = new Animation({
        ...header,
        optimize: false,
    });
    const pixelsCount = header.pixelsCount;
    let offset = 0;
    const dataView = new DataView(data.buffer);
    while (offset < data.length) {
        const frameType = dataView.getUint8(offset++);
        switch (frameType) {
            case frame_1.FrameType.VisualFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + pixelsCount * 3;
                const pixels = [];
                for (let i = offset; i < endIndex; i += 3) {
                    const color = new color_1.default(data[i], data[i + 1], data[i + 2]);
                    pixels.push(color);
                }
                offset = endIndex;
                animation.addFrame(new visual_frame_1.default(pixels, duration));
                break;
            }
            case frame_1.FrameType.DelayFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                animation.addFrame(new delay_frame_1.default(duration));
                break;
            }
            case frame_1.FrameType.AdditiveFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const changedPixelsCount = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + changedPixelsCount * 5;
                const pixels = [];
                for (let i = offset; i < endIndex; i += 3) {
                    const pixelIndex = dataView.getUint16(offset, true);
                    offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                    const indexedColor = new color_1.IndexedColor(pixelIndex, new color_1.default(data[i + 3], data[i + 4], data[i + 5]));
                    pixels.push(indexedColor);
                }
                offset = endIndex;
                animation.addFrame(new additive_frame_1.default(pixels, duration));
                break;
            }
            default:
                throw new Error(`Unsupported frame type: ${frameType}`);
        }
    }
    console.log(`frames count: ${animation._frames.length}, size: ${(animation.size / 1000).toFixed(2)} KB`);
    return animation;
};
