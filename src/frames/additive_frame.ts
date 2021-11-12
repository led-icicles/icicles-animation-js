import { IndexedColor } from "../utils/color";
import { UINT_16_MAX_SIZE } from "../utils/sizes";
import { Frame, FrameType } from "./frame";
import { VisualFrame } from "./visual_frame";

export class AdditiveFrame extends Frame {
  public readonly type: FrameType = FrameType.AdditiveFrame;
  static readonly maxChangedPixelIndex: number = UINT_16_MAX_SIZE;

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

  public mergeOnto(frame: VisualFrame): VisualFrame {
    const newFrame = frame.copyWith({ duration: this.duration });

    for (let i = 0; i < this.changedPixels.length; i++) {
      const { index, color } = this.changedPixels[i];
      newFrame.pixels[index] = color;
    }

    return newFrame;
  }

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
  get size(): number {
    const typeSize = 1;
    const durationSize = 2;
    const sizeFieldSize = 2;
    // [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
    const changedPixelsSize = this.changedPixels.length * 5;
    return typeSize + durationSize + sizeFieldSize + changedPixelsSize;
  }

  // [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)size][(x * 5)changedPixels]
  get size565(): number {
    const typeSize = 1;
    const durationSize = 2;
    const sizeFieldSize = 2;
    const changedPixelsSize = this.changedPixels.length * 4;
    return typeSize + durationSize + sizeFieldSize + changedPixelsSize;
  }

  public toBytes = ({
    rgb565 = false,
  }: { rgb565?: boolean } = {}): Uint8Array => {
    const size = rgb565 ? this.size565 : this.size;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame header
    data[dataPointer++] = rgb565 ? FrameType.AdditiveFrameRgb565 : this.type;
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

      if (rgb565) {
        const color565 = color.toRgb565();
        /// color 565 (little endian)
        data[dataPointer++] = color565 & 255;
        data[dataPointer++] = color565 >>> 8;
      } else {
        data[dataPointer++] = color.red;
        data[dataPointer++] = color.green;
        data[dataPointer++] = color.blue;
      }
    }

    return data;
  };
}
