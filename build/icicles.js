import { Color } from "./color";
import { VisualFrame } from "./frames/visual_frame";
export class Icicles {
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
            return new VisualFrame(copiedPixels, duration);
        };
        this.pixels = new Array(iciclesCount * ledsPerIcicle).fill(new Color(0, 0, 0));
    }
}
//# sourceMappingURL=icicles.js.map