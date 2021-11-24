import { UINT_16_SIZE_IN_BYTES, UINT_8_SIZE_IN_BYTES } from "..";
import { Color } from "../utils/color";
import { Frame, FrameType } from "./frame";

export class RadioColorFrame extends Frame {
  public readonly type: FrameType = FrameType.RadioColorFrame;

  constructor(
    public readonly panelIndex: number,
    public readonly color: Color,
    public readonly duration: number
  ) {
    super(duration);
  }

  /// [(uint8)type][(uint16)duration][(uint8)panelIndex][(uint8)red][(uint8)green][(uint8)blue]
  get size(): number {
    const frameType = UINT_8_SIZE_IN_BYTES;
    const durationSize = UINT_16_SIZE_IN_BYTES;
    const panelIndex = UINT_8_SIZE_IN_BYTES;
    const red = UINT_8_SIZE_IN_BYTES;
    const green = UINT_8_SIZE_IN_BYTES;
    const blue = UINT_8_SIZE_IN_BYTES;
    return frameType + durationSize + panelIndex + red + green + blue;
  }

  toBytes = (): Uint8Array => {
    const size = this.size;

    let dataPointer: number = 0;

    const data = new Uint8Array(size);
    /// frame type
    data[dataPointer++] = this.type;
    /// frame duration (little endian)
    data[dataPointer++] = this.duration & 255;
    data[dataPointer++] = this.duration >>> 8;
    /// panel index
    data[dataPointer++] = this.panelIndex;
    /// color
    data[dataPointer++] = this.color.red;
    data[dataPointer++] = this.color.green;
    data[dataPointer++] = this.color.blue;

    return data;
  };

  /// Copy visual frame instance
  public copy = (): RadioColorFrame =>
    new RadioColorFrame(this.panelIndex, this.color, this.duration);

  public copyWith = ({
    duration,
    color,
    panelIndex,
  }: {
    duration?: number;
    color?: Color;
    panelIndex?: number;
  } = {}): RadioColorFrame =>
    new RadioColorFrame(
      panelIndex ?? this.panelIndex,
      color ?? this.color,
      duration ?? this.duration
    );
}
