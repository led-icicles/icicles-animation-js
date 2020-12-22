import { Frame, FrameType } from "./frame";

export default class DelayFrame extends Frame {
  public readonly type: FrameType = FrameType.DelayFrame;

  constructor(public readonly duration: number) {
    super(duration);
  }

  /// [(1)type][(2)duration]
  get fileDataBytes(): number {
    const headerSize = 1;
    const durationSize = 2;
    return headerSize + durationSize;
  }

  toFileData = (): Uint8Array => {
    const size = this.fileDataBytes;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame header
    data[dataPointer++] = this.type;
    /// frame duration (little endian)
    data[dataPointer++] = this.duration & 255;
    data[dataPointer++] = this.duration >>> 8;

    return data;
  };
}
