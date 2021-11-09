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
import { AnimationHeader } from "./animation_header";
import { Color, IndexedColor } from "../utils/color";
import { FrameType } from "../frames/frame";
import { UINT_16_SIZE_IN_BYTES } from "../utils/sizes";
import { DelayFrame } from "../frames/delay_frame";
import { VisualFrame } from "../frames/visual_frame";
import { AdditiveFrame } from "../frames/additive_frame";
export class Animation {
    constructor(options) {
        var _b;
        this._frames = [];
        this.optimize = false;
        this.addFrame = (newFrame) => {
            if (!newFrame) {
                throw new Error("Frame was not provided.");
            }
            else if (newFrame.duration < 16) {
                throw new Error("The animation can't run faster than 60 FPS (preferred: 30 FPS). " +
                    "Therefore, the inter-frame delay cannot be less than 16ms.");
            }
            else if (newFrame instanceof DelayFrame) {
                this._frames.push(newFrame);
                return;
            }
            else if (newFrame instanceof AdditiveFrame) {
                this._frames.push(newFrame);
                return;
            }
            else if (!(newFrame instanceof VisualFrame)) {
                throw new Error("Unsupported frame type.");
            }
            else if (newFrame.pixels.length !== this._header.ledsCount) {
                throw new Error(`Unsupported frame length. ` +
                    `Current: ${newFrame.pixels.length}, ` +
                    `required: ${this._header.ledsCount}`);
            }
            if (this.optimize) {
                const changedPixels = AdditiveFrame.getChangedPixelsFromFrames(this._currentView, newFrame);
                const noPixelsChanges = changedPixels.length === 0;
                if (noPixelsChanges) {
                    /// TODO: We can then merge delay frames if possible.
                    this._frames.push(new DelayFrame(newFrame.duration));
                }
                else {
                    const additiveFrame = new AdditiveFrame(changedPixels, newFrame.duration);
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
                    const frameBytes = frame.toBytes();
                    yield new Promise((res, rej) => stream.write(frameBytes, (err) => {
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
        this._header = new AnimationHeader({
            name: options.name,
            xCount: options.xCount,
            yCount: options.yCount,
            loopsCount: options.loopsCount,
            versionNumber: options.versionNumber,
        });
        /// Before each animation leds are set to black color.
        /// But black color is not displayed. To set all pixels to black,
        /// you should add frame, even [DelayFrame]
        this._currentView = new VisualFrame(new Array(this._header.ledsCount).fill(new Color(0, 0, 0)), 
        /// zero duration - this is just a placeholder
        0);
        if (options) {
            this.optimize = (_b = options.optimize) !== null && _b !== void 0 ? _b : false;
        }
    }
    get frames() {
        return this._frames.slice(0);
    }
    get header() {
        return this._header;
    }
    *play() {
        let loop = 0;
        while (loop++ < this.header.loopsCount) {
            let currentView = VisualFrame.filled(this.header.pixelsCount, new Color(0, 0, 0), 0);
            for (const frame of this._frames) {
                if (frame instanceof VisualFrame) {
                    currentView = frame;
                    yield frame;
                }
                else if (frame instanceof DelayFrame) {
                    currentView = currentView.copyWith({ duration: frame.duration });
                    yield currentView;
                }
                else if (frame instanceof AdditiveFrame) {
                    currentView = frame.mergeOnto(currentView);
                    yield currentView;
                }
                else {
                    throw new Error(`Unsupported frame type: "${frame.type}"`);
                }
            }
        }
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
    const { header, data } = AnimationHeader.decode(buffer);
    const animation = new Animation(Object.assign(Object.assign({}, header), { optimize: false }));
    const pixelsCount = header.pixelsCount;
    let offset = 0;
    const dataView = new DataView(data.buffer);
    while (offset < data.length) {
        const frameType = dataView.getUint8(offset++);
        switch (frameType) {
            case FrameType.VisualFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + pixelsCount * 3;
                const pixels = [];
                for (let i = offset; i < endIndex; i += 3) {
                    const color = new Color(data[i], data[i + 1], data[i + 2]);
                    pixels.push(color);
                }
                offset = endIndex;
                animation.addFrame(new VisualFrame(pixels, duration));
                break;
            }
            case FrameType.DelayFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += UINT_16_SIZE_IN_BYTES;
                animation.addFrame(new DelayFrame(duration));
                break;
            }
            case FrameType.AdditiveFrame: {
                const duration = dataView.getUint16(offset, true);
                offset += UINT_16_SIZE_IN_BYTES;
                const changedPixelsCount = dataView.getUint16(offset, true);
                offset += UINT_16_SIZE_IN_BYTES;
                const endIndex = offset + changedPixelsCount * 5;
                const pixels = [];
                for (let i = offset; i < endIndex; i += 5) {
                    const pixelIndex = dataView.getUint16(i, true);
                    const indexedColor = new IndexedColor(pixelIndex, new Color(data[i + UINT_16_SIZE_IN_BYTES], data[i + UINT_16_SIZE_IN_BYTES + 1], data[i + UINT_16_SIZE_IN_BYTES + 2]));
                    pixels.push(indexedColor);
                }
                offset = endIndex;
                animation.addFrame(new AdditiveFrame(pixels, duration));
                break;
            }
            default:
                throw new Error(`Unsupported frame type: "${frameType}"`);
        }
    }
    console.log(`frames count: ${animation._frames.length}, size: ${(animation.size / 1000).toFixed(2)} KB`);
    return animation;
});
