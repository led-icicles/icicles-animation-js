import { IndexedColor } from "../color";
import { Frame, FrameType } from "./frame";
import VisualFrame from "./visual_frame";

export default class AdditiveFrame extends Frame {
  public readonly type: FrameType = FrameType.AdditiveFrame;

  constructor(
    public readonly changedPixels: Array<IndexedColor>,
    public readonly duration: number
  ) {
    super(duration);
  }

  static fromVisualFrames = (
    prevFrame: VisualFrame,
    nextFrame: VisualFrame,
    duration: number
  ): AdditiveFrame => {
    if (prevFrame.fileDataBytes !== nextFrame.fileDataBytes) {
      throw new Error("Frames cannot have different sizes.");
    }

    const changedPixels: Array<IndexedColor> = [];

    for (let index = 0; index < prevFrame.pixels.length; index++) {
      const prevPixel = prevFrame.pixels[index];
      const nextPixel = nextFrame.pixels[index];

      if (nextPixel.notEquals(prevPixel)) {
        const indexedColor = nextPixel.toIndexedColor(index);
        changedPixels.push(indexedColor);
      }
    }

    return new AdditiveFrame(changedPixels, duration);
  };

  // [(1 - uint8)type][(2 - uint16)duration][(4 - uint32)size][(x * 5)changedPixels]
  get fileDataBytes(): number {
    const headerSize = 1;
    const durationSize = 2;
    const sizeFieldSize = 4;
    // [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
    const changedPixelsSize = this.changedPixels.length * 5;
    return headerSize + durationSize + sizeFieldSize + changedPixelsSize;
  }

  toFileData = (): Uint8Array => {
    const size = this.fileDataBytes;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame header
    data[dataPointer++] = this.type;
    /// frame duration
    data[dataPointer++] = this.duration >>> 8;
    data[dataPointer++] = this.duration & 255;
    /// frame size
    const changedPixelsCount = this.changedPixels.length;
    data[dataPointer++] = changedPixelsCount >>> 8;
    data[dataPointer++] = changedPixelsCount & 255;
    /// frame pixels
    for (let i = 0; i < this.changedPixels.length; i++) {
      const changedPixel = this.changedPixels[i];
      const index = changedPixel.index;

      data[dataPointer++] = index >>> 8;
      data[dataPointer++] = index & 255;

      const color = changedPixel.color;
      data[dataPointer++] = color.red;
      data[dataPointer++] = color.green;
      data[dataPointer++] = color.blue;
    }

    return data;
  };
}
