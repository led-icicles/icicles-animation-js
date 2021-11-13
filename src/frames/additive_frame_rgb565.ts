import { AdditiveFrame } from ".";
import { FrameType } from "./frame";

export class AdditiveFrameRgb565 extends AdditiveFrame {
  public readonly type: FrameType = FrameType.AdditiveFrameRgb565;

  // [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)size][(x * 5)changedPixels]
  public get size(): number {
    const typeSize = 1;
    const durationSize = 2;
    const sizeFieldSize = 2;
    const changedPixelsSize = this.changedPixels.length * 4;
    return typeSize + durationSize + sizeFieldSize + changedPixelsSize;
  }

  public toBytes = (): Uint8Array => {
    const size = this.size;

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

      const color565 = color.toRgb565();
      /// color 565 (little endian)
      data[dataPointer++] = color565 & 255;
      data[dataPointer++] = color565 >>> 8;
    }

    return data;
  };

  public static fromAdditiveFrame(frame: AdditiveFrame): AdditiveFrameRgb565 {
    return new AdditiveFrameRgb565(
      frame.changedPixels.slice(0),
      frame.duration
    );
  }
}
