import { Color } from "../utils/color";
import { Frame, FrameType } from "./frame";

export class VisualFrame extends Frame {
  public readonly type: FrameType = FrameType.VisualFrame;

  constructor(
    public readonly pixels: Array<Color>,
    public readonly duration: number
  ) {
    super(duration);
  }

  public static filled(pixels: number, color: Color, duration: number) {
    return new VisualFrame(new Array(pixels).fill(color), duration);
  }

  /// Verify wether two visual frames are compatibility
  public static assertVisualFramesCompatibility = (
    prevFrame: VisualFrame,
    nextFrame: VisualFrame
  ) => {
    if (
      !(prevFrame instanceof VisualFrame) ||
      !(nextFrame instanceof VisualFrame)
    ) {
      throw new Error("Bad frame type.");
    } else if (prevFrame.size !== nextFrame.size) {
      throw new Error("Frames cannot have different sizes.");
    }
  };

  /// Copy visual frame instance
  public copy = () => new VisualFrame(this.pixels.slice(0), this.duration);
  public copyWith = ({
    duration,
    pixels,
  }: {
    duration?: number;
    pixels?: Array<Color>;
  } = {}) =>
    new VisualFrame(pixels ?? this.pixels.slice(0), duration ?? this.duration);

  /// [(1)type][(2)duration][(ledsCount*3)pixels]
  public get size(): number {
    const typeSize = 1;
    const durationSize = 2;
    const colorsSize = this.pixels.length * 3;
    return typeSize + durationSize + colorsSize;
  }

  /// [(1)type][(2)duration][(ledsCount*2)pixels]
  public get size565(): number {
    const typeSize = 1;
    const durationSize = 2;
    const colorsSize = this.pixels.length * 2;
    return typeSize + durationSize + colorsSize;
  }

  public static linearBlend = (
    from: VisualFrame,
    to: VisualFrame,
    progress: number,
    duration?: number
  ): VisualFrame => {
    VisualFrame.assertVisualFramesCompatibility(from, to);

    const pixels = from.pixels.map((color, index) =>
      Color.linearBlend(color, to.pixels[index], progress)
    );

    return new VisualFrame(pixels, duration ?? to.duration);
  };

  public darken = (progress: number, duration?: number): VisualFrame => {
    const pixels = this.pixels.map((color) => color.darken(progress));

    return new VisualFrame(pixels, duration ?? this.duration);
  };

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
    /// frame pixels
    for (let i = 0; i < this.pixels.length; i++) {
      if (rgb565) {
        const color565 = this.pixels[i].toRgb565();
        /// color 565 (little endian)
        data[dataPointer++] = color565 & 255;
        data[dataPointer++] = color565 >>> 8;
      } else {
        data[dataPointer++] = this.pixels[i].red;
        data[dataPointer++] = this.pixels[i].green;
        data[dataPointer++] = this.pixels[i].blue;
      }
    }

    return data;
  };
}
