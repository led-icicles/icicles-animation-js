import { Color } from "../utils/color";
import { VisualFrame } from "../frames/visual_frame";
import { Duration, Animation, RadioColorFrame, RadioPanelView } from "..";

export class Icicles {
  public readonly pixels: Array<Color>;

  public get xCount(): number {
    return this.animation.header.xCount;
  }
  public get yCount(): number {
    return this.animation.header.yCount;
  }

  constructor(public readonly animation: Animation) {
    this.pixels = new Array(animation.header.ledsCount).fill(new Color());
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

  public setPixels = (pixels: Array<Color>): void => {
    if (this.pixels.length !== pixels.length) {
      throw new Error(
        `Unsupported pixels length: "${pixels.length}". Size of "${this.pixels.length}" is allowed.`
      );
    }

    this.pixels.length = 0;
    this.pixels.push(...pixels);
  };

  public toFrame = (duration: Duration): VisualFrame => {
    const copiedPixels = this.pixels.slice(0);
    return new VisualFrame(copiedPixels, duration.milliseconds);
  };

  /**
   * When setting `duration` to any value other than 0ms, the panel color will be displayed
   * immediately and the next frame will be delayed by the specified time.
   *
   * Skipping the `duration` will cause the radio panel colors to be displayed
   * together with the `show` method invocation.
   */
  public setRadioPanelColor(
    panelIndex: number,
    color: Color,
    duration: Duration = new Duration({ milliseconds: 0 })
  ): void {
    this.animation.addFrame(
      new RadioColorFrame(panelIndex, color, duration.milliseconds)
    );
  }

  public show(duration: Duration): void {
    this.animation.addFrame(this.toFrame(duration));
  }
}
