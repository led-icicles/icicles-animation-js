"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animation = exports.AnimationView = exports.RadioPanelView = void 0;
const animation_header_1 = require("./animation_header");
const color_1 = require("../utils/color");
const frame_1 = require("../frames/frame");
const sizes_1 = require("../utils/sizes");
const delay_frame_1 = require("../frames/delay_frame");
const visual_frame_1 = require("../frames/visual_frame");
const additive_frame_1 = require("../frames/additive_frame");
const additive_frame_rgb565_1 = require("../frames/additive_frame_rgb565");
const visual_frame_rgb565_1 = require("../frames/visual_frame_rgb565");
const __1 = require("..");
class RadioPanelView {
    constructor(index, color) {
        this.index = index;
        this.color = color;
        this.copyWith = ({ index, color, } = {}) => new RadioPanelView(index !== null && index !== void 0 ? index : this.index, color !== null && color !== void 0 ? color : this.color);
    }
}
exports.RadioPanelView = RadioPanelView;
class AnimationView {
    constructor(frame, radioPanels) {
        this.frame = frame;
        this.radioPanels = radioPanels;
        this.copyWith = ({ frame, radioPanels, } = {}) => new AnimationView(frame !== null && frame !== void 0 ? frame : this.frame, radioPanels !== null && radioPanels !== void 0 ? radioPanels : this.radioPanels);
    }
}
exports.AnimationView = AnimationView;
class Animation {
    constructor(options) {
        var _b, _c;
        this._frames = [];
        this.optimize = false;
        this.useRgb565 = false;
        this.addFrame = (newFrame) => {
            if (!newFrame) {
                throw new Error("Frame was not provided.");
            }
            else if (newFrame instanceof delay_frame_1.DelayFrame) {
                this._frames.push(newFrame);
                return;
            }
            else if (newFrame instanceof __1.RadioColorFrame) {
                if (newFrame.panelIndex > this.header.radioPanelsCount) {
                    throw new Error(`Invalid panel index (${newFrame.panelIndex}). This animation supports "${this.header.radioPanelsCount}" radio panels.`);
                }
                if (this.optimize) {
                    const isChanged = newFrame.isBroadcast
                        ? this._radioPanels.some((p) => p.color.notEquals(newFrame.color))
                        : this._radioPanels
                            .find((p) => p.index == newFrame.panelIndex)
                            .color.notEquals(newFrame.color); // panel index is shifted due to broadcast panel at index 0
                    if (!isChanged) {
                        if (newFrame.duration === 0) {
                            console.warn(`[OPTIMIZE] Skipping radio frame. No color changes. Size reduced by ${newFrame.size}B.`);
                            return;
                        }
                        else {
                            const delayFrame = new delay_frame_1.DelayFrame(newFrame.duration);
                            console.warn(`[OPTIMIZE] No changes, replacing radio frame with delay frame. Size reduced by ${newFrame.size - delayFrame.size}B.`);
                            this._frames.push(delayFrame);
                            return;
                        }
                    }
                    else {
                        if (newFrame.isBroadcast) {
                            for (let i = 0; i < this._radioPanels.length; i++) {
                                this._radioPanels[i] = this._radioPanels[i].copyWith({
                                    color: newFrame.color,
                                });
                            }
                        }
                        else {
                            // shift index due to broadcast panel at 0
                            this._radioPanels[newFrame.panelIndex - 1] = this._radioPanels[newFrame.panelIndex - 1].copyWith({
                                color: newFrame.color,
                            });
                        }
                        this._frames.push(newFrame);
                        return;
                    }
                }
                else {
                    this._frames.push(newFrame);
                }
                return;
            }
            else if (newFrame.duration < 16) {
                throw new Error("The animation can't run faster than 60 FPS (preferred: 30 FPS). " +
                    "Therefore, the inter-frame delay cannot be less than 16ms.");
            }
            else if (newFrame instanceof additive_frame_rgb565_1.AdditiveFrameRgb565 ||
                newFrame instanceof visual_frame_rgb565_1.VisualFrameRgb565) {
                this._frames.push(newFrame);
                return;
            }
            else if (newFrame instanceof additive_frame_1.AdditiveFrame) {
                this._frames.push(newFrame);
                return;
            }
            else if (!(newFrame instanceof visual_frame_1.VisualFrame)) {
                throw new Error("Unsupported frame type.");
            }
            else if (newFrame.pixels.length !== this._header.ledsCount) {
                throw new Error(`Unsupported frame length. ` +
                    `Current: ${newFrame.pixels.length}, ` +
                    `required: ${this._header.ledsCount}`);
            }
            if (this.optimize) {
                const changedPixels = additive_frame_1.AdditiveFrame.getChangedPixelsFromFrames(this._currentView, newFrame);
                const noPixelsChanges = changedPixels.length === 0;
                if (noPixelsChanges) {
                    /// TODO: We can then merge delay frames if possible.
                    this._frames.push(new delay_frame_1.DelayFrame(newFrame.duration));
                }
                else {
                    const additiveFrame = new additive_frame_1.AdditiveFrame(changedPixels, newFrame.duration);
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
            this._currentView = newFrame;
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
        this.toFile = (path) => __awaiter(this, void 0, void 0, function* () {
            const isBrowser = typeof window !== "undefined";
            if (isBrowser) {
                throw new Error("This method is not supported in browser env");
            }
            let toFileStart = Date.now();
            console.log(`Creating animation file: optimize=${this.optimize}`);
            const fs = require("fs");
            const p = require("path");
            const targetPath = p.resolve(path);
            const targetDir = p.dirname(path);
            yield fs.promises.mkdir(targetDir, { recursive: true });
            const stream = fs.createWriteStream(targetPath, { encoding: "binary" });
            try {
                console.log("===== HEADER =====");
                console.log("Writing header...");
                yield new Promise((res, rej) => stream.write(this._header.encode(), (err) => {
                    if (err)
                        rej(err);
                    res();
                }));
                console.log("Header written.");
                console.log("=== END HEADER ===");
                console.log(`Writing ${this._frames.length} frames...`);
                let framesToFileStart = Date.now();
                for (const frame of this._frames) {
                    let bytes;
                    if (this.useRgb565) {
                        if (frame instanceof visual_frame_1.VisualFrame) {
                            bytes = visual_frame_rgb565_1.VisualFrameRgb565.fromVisualFrame(frame).toBytes();
                        }
                        else if (frame instanceof additive_frame_1.AdditiveFrame) {
                            bytes = additive_frame_rgb565_1.AdditiveFrameRgb565.fromAdditiveFrame(frame).toBytes();
                        }
                    }
                    bytes !== null && bytes !== void 0 ? bytes : (bytes = frame.toBytes());
                    yield new Promise((res, rej) => stream.write(bytes, (err) => {
                        if (err)
                            rej(err);
                        res();
                    }));
                }
                console.log(`All frames written in ${Date.now() - framesToFileStart}ms.`);
                stream.end();
                console.log(`frames count: ${this._frames.length}, size: ${(this.size / 1000).toFixed(2)} KB`);
                console.log(`File written in ${Date.now() - toFileStart}ms.  path="${targetPath}".`);
            }
            catch (err) {
                stream.destroy();
                fs.unlinkSync(targetPath);
                throw err;
            }
        });
        this._header = new animation_header_1.AnimationHeader({
            name: options.name,
            xCount: options.xCount,
            yCount: options.yCount,
            loopsCount: options.loopsCount,
            versionNumber: options.versionNumber,
            radioPanelsCount: options.radioPanelsCount,
        });
        /// Before each animation leds are set to black color.
        /// But black color is not displayed. To set all pixels to black,
        /// you should add frame, even [DelayFrame]
        this._currentView = new visual_frame_1.VisualFrame(new Array(this._header.ledsCount).fill(new color_1.Color(0, 0, 0)), 
        /// zero duration - this is just a placeholder
        0);
        this.optimize = (_b = options.optimize) !== null && _b !== void 0 ? _b : false;
        this.useRgb565 = (_c = options.useRgb565) !== null && _c !== void 0 ? _c : false;
        this._radioPanels = new Array(options.radioPanelsCount)
            .fill(undefined)
            .map((_, inedex) => new RadioPanelView(inedex + 1, new color_1.Color()));
    }
    get frames() {
        return this._frames.slice(0);
    }
    get header() {
        return this._header;
    }
    *play() {
        const intialFrame = visual_frame_1.VisualFrame.filled(this.header.pixelsCount, new color_1.Color(0, 0, 0), 0);
        const radioPanels = new Array(this.header.radioPanelsCount)
            .fill(undefined)
            // radio panels indexes starts from 1 (0 is a broadcast channel)
            .map((_, index) => new RadioPanelView(index + 1, new color_1.Color()));
        let loop = 0;
        while (loop++ < this.header.loopsCount) {
            let view = new AnimationView(intialFrame, radioPanels);
            for (const frame of this._frames) {
                if (frame instanceof visual_frame_1.VisualFrame) {
                    view = view.copyWith({ frame });
                    yield view;
                }
                else if (frame instanceof delay_frame_1.DelayFrame) {
                    view = view.copyWith({
                        frame: view.frame.copyWith({ duration: frame.duration }),
                    });
                    yield view;
                }
                else if (frame instanceof additive_frame_1.AdditiveFrame) {
                    view = view.copyWith({
                        frame: frame.mergeOnto(view.frame),
                    });
                    yield view;
                }
                else if (frame instanceof __1.RadioColorFrame) {
                    view = view.copyWith({
                        frame: view.frame.copyWith({ duration: frame.duration }),
                        radioPanels: radioPanels.map((panel) => {
                            if (frame.isBroadcast || frame.panelIndex === panel.index) {
                                return panel.copyWith({ color: frame.color });
                            }
                            else {
                                return panel;
                            }
                        }),
                    });
                    if (frame.duration !== 0) {
                        yield view;
                    }
                }
                else {
                    throw new Error(`Unsupported frame type: "${frame.type}"`);
                }
            }
        }
        return new AnimationView(intialFrame, radioPanels);
    }
    get currentView() {
        return this._currentView;
    }
    //** Animation duration in milliseconds - loops included */
    get duration() {
        return (this._frames.reduce((p, n) => p + n.duration, 0) * this.header.loopsCount);
    }
    //** Animation frames count - loops are included */
    get animationFramesCount() {
        return this._frames.length * this.header.loopsCount;
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
exports.Animation = Animation;
_a = Animation;
Animation.fromFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
        throw new Error("This method is not supported in browser env");
    }
    const fs = require("fs");
    const buffer = yield fs.promises.readFile(path);
    return Animation.decode(buffer);
});
Animation.decode = (buffer) => __awaiter(void 0, void 0, void 0, function* () {
    const { header, data } = animation_header_1.AnimationHeader.decode(buffer);
    const animation = new Animation(Object.assign(Object.assign({}, header), { optimize: false }));
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
                    const color = new color_1.Color(data[i], data[i + 1], data[i + 2]);
                    pixels.push(color);
                }
                offset = endIndex;
                animation.addFrame(new visual_frame_1.VisualFrame(pixels, duration));
                break;
            }
            case frame_1.FrameType.VisualFrameRgb565: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + pixelsCount * 2;
                const pixels = new Array(pixelsCount);
                let arrayIndex = 0;
                for (let i = offset; i < endIndex; i += 2) {
                    const colorData = dataView.getUint16(i, true);
                    const r5 = (colorData >> 11) & 0x1f;
                    const g6 = (colorData >> 5) & 0x3f;
                    const b5 = colorData & 0x1f;
                    const r8 = (r5 * 527 + 23) >> 6;
                    const g8 = (g6 * 259 + 33) >> 6;
                    const b8 = (b5 * 527 + 23) >> 6;
                    const color = new color_1.Color(r8, g8, b8);
                    pixels[arrayIndex++] = color;
                }
                offset = endIndex;
                animation.addFrame(new visual_frame_rgb565_1.VisualFrameRgb565(pixels, duration));
                break;
            }
            case frame_1.FrameType.DelayFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                animation.addFrame(new delay_frame_1.DelayFrame(duration));
                break;
            }
            case frame_1.FrameType.RadioColorFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const panelIndex = dataView.getUint8(offset++);
                const red = dataView.getUint8(offset++);
                const green = dataView.getUint8(offset++);
                const blue = dataView.getUint8(offset++);
                const color = new color_1.Color(red, green, blue);
                animation.addFrame(new __1.RadioColorFrame(panelIndex, color, duration));
                break;
            }
            case frame_1.FrameType.AdditiveFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const changedPixelsCount = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + changedPixelsCount * 5;
                const pixels = [];
                for (let i = offset; i < endIndex; i += 5) {
                    const pixelIndex = dataView.getUint16(i, true);
                    const indexedColor = new color_1.IndexedColor(pixelIndex, new color_1.Color(data[i + sizes_1.UINT_16_SIZE_IN_BYTES], data[i + sizes_1.UINT_16_SIZE_IN_BYTES + 1], data[i + sizes_1.UINT_16_SIZE_IN_BYTES + 2]));
                    pixels.push(indexedColor);
                }
                offset = endIndex;
                animation.addFrame(new additive_frame_1.AdditiveFrame(pixels, duration));
                break;
            }
            case frame_1.FrameType.AdditiveFrameRgb565: {
                const duration = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const changedPixelsCount = dataView.getUint16(offset, true);
                offset += sizes_1.UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + changedPixelsCount * 4;
                const pixels = new Array(changedPixelsCount);
                let arrayIndex = 0;
                for (let i = offset; i < endIndex; i += 4) {
                    const pixelIndex = dataView.getUint16(i, true);
                    const colorData = dataView.getUint16(i + sizes_1.UINT_16_SIZE_IN_BYTES, true);
                    const r5 = (colorData >> 11) & 0x1f;
                    const g6 = (colorData >> 5) & 0x3f;
                    const b5 = colorData & 0x1f;
                    const r8 = (r5 * 527 + 23) >> 6;
                    const g8 = (g6 * 259 + 33) >> 6;
                    const b8 = (b5 * 527 + 23) >> 6;
                    const color = new color_1.Color(r8, g8, b8);
                    const indexedColor = new color_1.IndexedColor(pixelIndex, color);
                    pixels[arrayIndex++] = indexedColor;
                }
                offset = endIndex;
                animation.addFrame(new additive_frame_rgb565_1.AdditiveFrameRgb565(pixels, duration));
                break;
            }
            default:
                throw new Error(`Unsupported frame type: "${frameType}"`);
        }
    }
    console.log(`frames count: ${animation._frames.length}, size: ${(animation.size / 1000).toFixed(2)} KB`);
    return animation;
});
