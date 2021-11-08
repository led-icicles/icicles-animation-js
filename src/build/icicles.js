"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = __importDefault(require("./color"));
const visual_frame_1 = __importDefault(require("./frames/visual_frame"));
class Icicles {
    constructor(iciclesCount, ledsPerIcicle) {
        this.iciclesCount = iciclesCount;
        this.ledsPerIcicle = ledsPerIcicle;
        this.getPixelIndex = (icicle, led) => {
            return icicle * this.ledsPerIcicle + led;
        };
        this.setPixelColor = (icicle, led, color) => {
            const index = this.getPixelIndex(icicle, led);
            this.pixels[index] = color;
        };
        this.setIcicleColor = (icicle, color) => {
            const index = this.getPixelIndex(icicle, 0);
            for (let i = index; i < index + this.ledsPerIcicle; i++) {
                this.pixels[i] = color;
            }
        };
        this.setPixelColorAtIndex = (index, color) => {
            this.pixels[index] = color;
        };
        this.getPixelColor = (icicle, led) => {
            const index = this.getPixelIndex(icicle, led);
            return this.pixels[index];
        };
        this.setAllPixelsColor = (color) => {
            this.pixels.fill(color);
        };
        this.setPixels = (pixels) => {
            if (this.pixels.length !== pixels.length) {
                throw new Error("Unsupported pixels count");
            }
            this.pixels.length = 0;
            this.pixels.push(...pixels);
        };
        this.toFrame = (duration) => {
            const copiedPixels = this.pixels.slice(0);
            return new visual_frame_1.default(copiedPixels, duration);
        };
        this.pixels = new Array(iciclesCount * ledsPerIcicle).fill(new color_1.default(0, 0, 0));
    }
}
exports.default = Icicles;
