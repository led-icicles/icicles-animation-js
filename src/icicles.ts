import { Color } from "./color";
import { VisualFrame } from "./frames/visual_frame";

export class Icicles {
  public readonly pixels: Array<Color>;
  constructor(
    public readonly iciclesCount: number,
    public readonly ledsPerIcicle: number
  ) {
    this.pixels = new Array(iciclesCount * ledsPerIcicle).fill(
      new Color(0, 0, 0)
    );
  }

  getPixelIndex = (icicle: number, led: number) => {
    return icicle * this.ledsPerIcicle + led;
  };

  setPixelColor = (icicle: number, led: number, color: Color) => {
    const index = this.getPixelIndex(icicle, led);
    this.pixels[index] = color;
  };

  setIcicleColor = (icicle: number, color: Color) => {
    const index = this.getPixelIndex(icicle, 0);
    for (let i = index; i < index + this.ledsPerIcicle; i++) {
      this.pixels[i] = color;
    }
  };

  setPixelColorAtIndex = (index: number, color: Color) => {
    this.pixels[index] = color;
  };

  getPixelColor = (icicle: number, led: number): Color => {
    const index = this.getPixelIndex(icicle, led);
    return this.pixels[index];
  };

  setAllPixelsColor = (color: Color) => {
    this.pixels.fill(color);
  };

  setPixels = (pixels: Array<Color>) => {
    if (this.pixels.length !== pixels.length) {
      throw new Error("Unsupported pixels count");
    }

    this.pixels.length = 0;
    this.pixels.push(...pixels);
  };

  toFrame = (duration: number): VisualFrame => {
    const copiedPixels = this.pixels.slice(0);
    return new VisualFrame(copiedPixels, duration);
  };
}
