import { Color } from "../utils/color";
import { VisualFrame } from "../frames/visual_frame";

export class Icicles {
  public readonly pixels: Array<Color>;
  constructor(public readonly xCount: number, public readonly yCount: number) {
    this.pixels = new Array(xCount * yCount).fill(new Color(0, 0, 0));
  }

  private _isValidIndex(index: number): void {
    if (index >= this.pixels.length || index < 0) {
      throw new Error(
        `Invalid pixel index provided: "${index}". Valid range is from "0" to "${
          this.pixels.length - 1
        }"`
      );
    }
  }

  public getPixelIndex = (x: number, y: number): number => {
    const index = x * this.yCount + y;
    this._isValidIndex(index);
    return index;
  };

  public getPixelColor = (x: number, y: number): Color => {
    const index = this.getPixelIndex(x, y);
    return this.pixels[index];
  };

  public getPixelColorAtIndex = (index: number): Color => {
    this._isValidIndex(index);

    return this.pixels[index];
  };

  public setPixelColor = (x: number, y: number, color: Color): void => {
    const index = this.getPixelIndex(x, y);
    this.pixels[index] = color;
  };

  public setColumnColor = (x: number, color: Color): void => {
    const index = this.getPixelIndex(x, 0);
    for (let i = index; i < index + this.yCount; i++) {
      this.pixels[i] = color;
    }
  };

  public setRowColor = (y: number, color: Color): void => {
    for (let x = 0; x < this.xCount; x++) {
      const index = this.getPixelIndex(x, y);
      this.pixels[index] = color;
    }
  };

  public setPixelColorAtIndex = (index: number, color: Color) => {
    this._isValidIndex(index);

    this.pixels[index] = color;
  };

  public setAllPixelsColor = (color: Color) => {
    this.pixels.fill(color);
  };

  public setPixels = (pixels: Array<Color>) => {
    if (this.pixels.length !== pixels.length) {
      throw new Error(
        `Unsupported pixels length: "${pixels.length}". Size of "${this.pixels.length}" is allowed.`
      );
    }

    this.pixels.length = 0;
    this.pixels.push(...pixels);
  };

  public toFrame = (duration: number): VisualFrame => {
    const copiedPixels = this.pixels.slice(0);
    return new VisualFrame(copiedPixels, duration);
  };
}
