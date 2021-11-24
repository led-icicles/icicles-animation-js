import { UINT_16_MAX_SIZE } from "..";

export enum FrameType {
  /// [(1)type][(2)duration]
  DelayFrame = 1,

  /// [(1)type][(2)duration][(ledsCount*3)pixels]
  VisualFrame = 2,

  /// [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)changedPixelsCount][(x)changedPixels]
  ///
  /// Changed pixels are described by:
  /// [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
  /// Therefore it is possible to index `65535` pixels (leds)
  AdditiveFrame = 3,

  /// [(1)type][(2)duration][(ledsCount*2)pixels]
  VisualFrameRgb565 = 12,

  /// [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)changedPixelsCount][(x)changedPixels]
  ///
  /// Changed pixels are described by:
  /// [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
  /// Therefore it is possible to index `65535` pixels (leds)
  AdditiveFrameRgb565 = 13,

  /// [(uint8)type][(uint16)duration][(uint8)panelIndex][(uint8)red][(uint8)green][(uint8)blue]
  RadioColorFrame = 100,
}

export abstract class Frame {
  static readonly maxDuration: number = UINT_16_MAX_SIZE;
  public abstract readonly type: FrameType;

  constructor(public readonly duration: number) {
    if (typeof duration !== "number" || duration > Frame.maxDuration) {
      throw new Error(
        "Not valid duration provided. Duration should be larger or equal 0 but no larger than [Frame.maxDuration]."
      );
    }
  }

  /// Frame size in bytes
  public abstract get size(): number;
  public abstract toBytes(): Uint8Array;
}
