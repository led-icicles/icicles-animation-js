import Color, { IndexedColor } from "../color";
import { Frame, FrameType } from "./frame";
import VisualFrame from "./visual_frame";

export default class AdditiveFrame extends Frame {
  public readonly type: FrameType = FrameType.AdditiveFrame;
  static readonly maxChangedPixelIndex: number = 65535;

  constructor(
    public readonly changedPixels: Array<IndexedColor>,
    public readonly duration: number
  ) {
    super(duration);

    if (changedPixels == null) {
      throw new Error("changedPixels argument cannot be null");
    } else if (changedPixels.length > AdditiveFrame.maxChangedPixelIndex) {
      throw new Error(
        "Provided more chnaged pixels than maximum allowed. Check [AdditiveFrame.maxChangedPixelIndex]."
      );
    }
  }

  public static getChangedPixelsFromFrames = (
    prevFrame: VisualFrame,
    nextFrame: VisualFrame
  ): Array<IndexedColor> => {
    VisualFrame.assertVisualFramesCompatibility(prevFrame, nextFrame);

    const changedPixels: Array<IndexedColor> = [];

    for (let index = 0; index < prevFrame.pixels.length; index++) {
      const prevPixel = prevFrame.pixels[index];
      const nextPixel = nextFrame.pixels[index];

      if (nextPixel.notEquals(prevPixel)) {
        const indexedColor = nextPixel.toIndexedColor(index);
        changedPixels.push(indexedColor);
      }
    }

    return changedPixels;
  };

  static fromVisualFrames = (
    prevFrame: VisualFrame,
    nextFrame: VisualFrame
  ): AdditiveFrame => {
    const changedPixels = AdditiveFrame.getChangedPixelsFromFrames(
      prevFrame,
      nextFrame
    );

    return new AdditiveFrame(changedPixels, nextFrame.duration);
  };

  // [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)size][(x * 5)changedPixels]
  get fileDataBytes(): number {
    const typeSize = 1;
    const durationSize = 2;
    const sizeFieldSize = 2;
    // [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
    const changedPixelsSize = this.changedPixels.length * 5;
    return typeSize + durationSize + sizeFieldSize + changedPixelsSize;
  }

  public toFileData = (): Uint8Array => {
    const size = this.fileDataBytes;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame header
    data[dataPointer++] = this.type;
    /// frame duration (little endian)
    data[dataPointer++] = this.duration & 255;
    data[dataPointer++] = this.duration >>> 8;
    /// frame size (little endian)
    const changedPixelsCount = this.changedPixels.length;
    data[dataPointer++] = changedPixelsCount & 255;
    data[dataPointer++] = changedPixelsCount >>> 8;
    /// frame pixels
    for (let i = 0; i < this.changedPixels.length; i++) {
      const changedPixel = this.changedPixels[i];
      const index = changedPixel.index;

      /// pixel index (little endian)
      data[dataPointer++] = index & 255;
      data[dataPointer++] = index >>> 8;

      const color = changedPixel.color;
      data[dataPointer++] = color.red;
      data[dataPointer++] = color.green;
      data[dataPointer++] = color.blue;
    }

    return data;
  };
}
