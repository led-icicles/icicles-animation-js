import { ColorJson } from "./color";

enum FrameType {
  // SD Animation Delay
  // TODO: remove?
  SDADelay = 1,

  // SD Animation Frame
  VisualFrame = 2,
}

export default class Frame {
  static maxDuration: number = 65535;

  constructor(
    public readonly colors: Array<ColorJson>,
    public readonly duration: number
  ) {
    if (typeof duration !== "number" || duration > Frame.maxDuration) {
      throw new Error(
        "Not valid duration provided. Duration should be larger or equal 0 and smaller than [Frame.maxDuration]."
      );
    }
  }

  /// [(1)header][(2)duration][(ledsCount*3)pixels]
  get fileDataBytes(): number {
    const headerSize = 1;
    const durationSize = 2;
    const colorsSize = this.colors.length * 3;
    return headerSize + durationSize + colorsSize;
  }

  toFileData = (): Uint8Array => {
    const size = this.fileDataBytes;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame header
    data[dataPointer++] = FrameType.VisualFrame;
    /// frame duration
    data[dataPointer++] = this.duration >>> 8;
    data[dataPointer++] = this.duration & 255;
    /// frame pixels
    for (let i = 0; i < this.colors.length; i++) {
      data[dataPointer++] = this.colors[i].r;
      data[dataPointer++] = this.colors[i].g;
      data[dataPointer++] = this.colors[i].b;
    }

    return data;
  };
}
