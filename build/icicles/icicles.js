"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Icicles = void 0;
const color_1 = require("../utils/color");
const visual_frame_1 = require("../frames/visual_frame");
class Icicles {
    constructor(xCount, yCount) {
        this.xCount = xCount;
        this.yCount = yCount;
        this.getPixelIndex = (x, y) => {
            const index = x * this.yCount + y;
            this._isValidIndex(index);
            return index;
        };
        this.getPixelColor = (x, y) => {
            const index = this.getPixelIndex(x, y);
            return this.pixels[index];
        };
        this.getPixelColorAtIndex = (index) => {
            this._isValidIndex(index);
            return this.pixels[index];
        };
        this.setPixelColor = (x, y, color) => {
            const index = this.getPixelIndex(x, y);
            this.pixels[index] = color;
        };
        this.setColumnColor = (x, color) => {
            const index = this.getPixelIndex(x, 0);
            for (let i = index; i < index + this.yCount; i++) {
                this.pixels[i] = color;
            }
        };
        this.setRowColor = (y, color) => {
            for (let x = 0; x < this.xCount; x++) {
                const index = this.getPixelIndex(x, y);
                this.pixels[index] = color;
            }
        };
        this.setPixelColorAtIndex = (index, color) => {
            this._isValidIndex(index);
            this.pixels[index] = color;
        };
        this.setAllPixelsColor = (color) => {
            this.pixels.fill(color);
        };
        this.setPixels = (pixels) => {
            if (this.pixels.length !== pixels.length) {
                throw new Error(`Unsupported pixels length: "${pixels.length}". Size of "${this.pixels.length}" is allowed.`);
            }
            this.pixels.length = 0;
            this.pixels.push(...pixels);
        };
        this.toFrame = (duration) => {
            const copiedPixels = this.pixels.slice(0);
            return new visual_frame_1.VisualFrame(copiedPixels, duration);
        };
        this.pixels = new Array(xCount * yCount).fill(new color_1.Color(0, 0, 0));
    }
    _isValidIndex(index) {
        if (index >= this.pixels.length || index < 0) {
            throw new Error(`Invalid pixel index provided: "${index}". Valid range is from "0" to "${this.pixels.length - 1}"`);
        }
    }
}
exports.Icicles = Icicles;
