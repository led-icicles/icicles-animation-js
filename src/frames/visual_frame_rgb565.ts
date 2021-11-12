import { FrameType, VisualFrame } from ".";

export class VisualFrameRgb565 extends VisualFrame {
  public readonly type: FrameType = FrameType.VisualFrameRgb565;

  /// [(1)type][(2)duration][(ledsCount*2)pixels]
  public get size(): number {
    const typeSize = 1;
    const durationSize = 2;
    const colorsSize = this.pixels.length * 2;
    return typeSize + durationSize + colorsSize;
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
    /// frame pixels
    for (let i = 0; i < this.pixels.length; i++) {
      const color565 = this.pixels[i].toRgb565();
      /// color 565 (little endian)
      data[dataPointer++] = color565 & 255;
      data[dataPointer++] = color565 >>> 8;
    }

    return data;
  };
}
