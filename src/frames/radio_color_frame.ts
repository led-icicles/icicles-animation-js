import {
  UINT_16_SIZE_IN_BYTES,
  UINT_8_MAX_SIZE,
  UINT_8_SIZE_IN_BYTES,
} from "..";
import { Color } from "../utils/color";
import { Frame, FrameType } from "./frame";

export class RadioColorFrame extends Frame {
  static readonly maxPanelIndex: number = UINT_8_MAX_SIZE;
  public readonly type: FrameType = FrameType.RadioColorFrame;

  constructor(
    public readonly panelIndex: number,
    public readonly color: Color,
    public readonly duration: number
  ) {
    super(duration);
    if (panelIndex > UINT_8_MAX_SIZE) {
      throw new Error(
        "Not valid panel index provided. Panel index should be larger or equal 0 (for broadcast) and smaller than [RadioColorFrame.maxPanelIndex]."
      );
    }
  }

  /// [(uint8)type][(uint16)duration][(uint8)panelIndex][(uint8)red][(uint8)green][(uint8)blue]
  get size(): number {
    const frameTypeSize = UINT_8_SIZE_IN_BYTES;
    const durationSize = UINT_16_SIZE_IN_BYTES;
    const panelIndexSize = UINT_8_SIZE_IN_BYTES;
    const redSize = UINT_8_SIZE_IN_BYTES;
    const greenSize = UINT_8_SIZE_IN_BYTES;
    const blueSize = UINT_8_SIZE_IN_BYTES;
    return (
      frameTypeSize +
      durationSize +
      panelIndexSize +
      redSize +
      greenSize +
      blueSize
    );
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
