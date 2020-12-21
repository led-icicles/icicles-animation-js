import Color from "../color";
import { Frame, FrameType } from "./frame";

export default class VisualFrame extends Frame {
  public readonly type: FrameType = FrameType.VisualFrame;

  constructor(
    public readonly pixels: Array<Color>,
    public readonly duration: number
  ) {
    super(duration);
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
    } else if (prevFrame.fileDataBytes !== nextFrame.fileDataBytes) {
      throw new Error("Frames cannot have different sizes.");
    }
  };

  /// Copy visual frame instance
  public copy = () => new VisualFrame(this.pixels.slice(0), this.duration);

  /// [(1)type][(2)duration][(ledsCount*3)pixels]
  public get fileDataBytes(): number {
    const typeSize = 1;
    const durationSize = 2;
    const colorsSize = this.pixels.length * 3;
    return typeSize + durationSize + colorsSize;
  }

  public toFileData = (): Uint8Array => {
    const size = this.fileDataBytes;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame header
    data[dataPointer++] = this.type;
    /// frame duration
    data[dataPointer++] = this.duration >>> 8;
    data[dataPointer++] = this.duration & 255;
    /// frame pixels
    for (let i = 0; i < this.pixels.length; i++) {
      data[dataPointer++] = this.pixels[i].red;
      data[dataPointer++] = this.pixels[i].green;
      data[dataPointer++] = this.pixels[i].blue;
    }

    return data;
  };
}
