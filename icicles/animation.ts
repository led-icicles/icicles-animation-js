import fs from "fs";
import { TextEncoder } from "util";
import Color from "./color";
import AdditiveFrame from "./frames/additive_frame";
import DelayFrame from "./frames/delay_frame";
import { Frame } from "./frames/frame";
import VisualFrame from "./frames/visual_frame";

type AnimationOptions = {
  optimize?: boolean;
  version?: 1;
};
const newestAnimationVersion = 1;

interface AnimationHeaderData {
  readonly version: number;
  readonly animationName: string;
  readonly xCount: number;
  readonly yCount: number;
}

export class AnimationHeader implements AnimationHeaderData {
  readonly version: number;
  readonly animationName: string;
  readonly xCount: number;
  readonly yCount: number;

  constructor(data: AnimationHeaderData) {
    this.version = data.version;
    this.animationName = data.animationName;
    this.xCount = data.xCount;
    this.yCount = data.yCount;
  }

  public get ledsCount(): number {
    return this.xCount * this.yCount;
  }

  public get size(): number {
    /// NULL CHAR IS USED AS THE SEPARATOR
    const NULL_CHAR_BYTE_COUNT = 1;

    const animationNameSize = this.animationName.length + NULL_CHAR_BYTE_COUNT;

    return animationNameSize;
  }

  private _getEncodedAnimationName = (): Uint8Array => {
    const encoder = new TextEncoder();
    const encodedName = encoder.encode(this.animationName);
    const encodednNameWithNullChar = new Uint8Array(encodedName.length + 1);
    encodednNameWithNullChar.set(encodedName);
    const NULL_CHAR = 0;
    encodednNameWithNullChar[encodedName.length] = NULL_CHAR;
    return encodednNameWithNullChar;
  };

  public encode = (): Uint8Array => {
    return this._getEncodedAnimationName();
  };
}

export default class Animation {
  private readonly _frames: Array<Frame> = [];
  private readonly _header: AnimationHeader;

  /// Current pixels view
  private currentView: VisualFrame;
  public readonly optimize: boolean = false;

  constructor(
    animationName: string,
    xCount: number,
    yCount: number,
    options?: AnimationOptions
  ) {
    this._header = new AnimationHeader({
      animationName: animationName,
      xCount,
      yCount,
      version: options?.version ?? newestAnimationVersion,
    });
    /// Before each animation leds are set to black color.
    /// But black color is not displayed. To set all pixels to black,
    /// you should add frame, even [DelayFrame]
    this.currentView = new VisualFrame(
      new Array(this._header.ledsCount).fill(new Color(0, 0, 0)),
      /// zero duration - this is just a placeholder
      0
    );
    if (options) {
      this.optimize = options.optimize ?? false;
    }
  }

  addFrame = (newFrame: VisualFrame) => {
    if (!newFrame) {
      throw new Error("Frame was not provided.");
    } else if (!(newFrame instanceof VisualFrame)) {
      throw new Error("Unsupported frame type.");
    } else if (newFrame.pixels.length !== this._header.ledsCount) {
      throw new Error(
        `Unsupported frame length. ` +
          `Current: ${newFrame.pixels.length}, ` +
          `required: ${this._header.ledsCount}`
      );
    }

    if (this.optimize) {
      const changedPixels = AdditiveFrame.getChangedPixelsFromFrames(
        this.currentView,
        newFrame
      );

      const noPixelsChanges = changedPixels.length === 0;

      if (noPixelsChanges) {
        /// TODO: We can then merge delay frames if possible.
        this._frames.push(new DelayFrame(newFrame.duration));
      } else {
        const additiveFrame = new AdditiveFrame(
          changedPixels,
          newFrame.duration
        );
        const isAdditiveFrameSmaller = additiveFrame.size < newFrame.size;
        if (isAdditiveFrameSmaller) {
          this._frames.push(additiveFrame);
        } else {
          this._frames.push(newFrame);
        }
      }
    } else {
      this._frames.push(newFrame);
    }

    /// set current view
    this.currentView = newFrame;
  };

  /// Animation size in bytes
  public get size(): number {
    let framesDataSize = 0;
    for (let i = 0; i < this._frames.length; i++) {
      const frame = this._frames[i];
      framesDataSize += frame.size;
    }

    return this._header.size + framesDataSize;
  }

  toBytes = (): Uint8Array => {
    if (this._frames.length === 0) {
      throw new Error("Animation is empty.");
    }

    const data = new Uint8Array(this.size);

    const encodedHeader = this._header.encode();
    const headerSize = encodedHeader.length;
    data.set(encodedHeader);

    let offset = headerSize;
    for (const frame of this._frames) {
      const frameBytes = frame.toBytes();
      const frameSize = frame.size;

      data.set(frameBytes, offset);

      offset += frameSize;
    }

    return data;
  };

  toFile = async (path: string) => {
    const stream = fs.createWriteStream(path, { encoding: "binary" });

    await new Promise<void>((res, rej) =>
      stream.write(this._header.encode(), (err) => {
        if (err) rej(err);
        res();
      })
    );

    for (const frame of this._frames) {
      const frameBytes = frame.toBytes();

      await new Promise<void>((res, rej) =>
        stream.write(frameBytes, (err) => {
          if (err) rej(err);
          res();
        })
      );
    }
  };
}
