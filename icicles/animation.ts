import fs from "fs";
import { TextEncoder } from "util";
import Color from "./color";
import AdditiveFrame from "./frames/additive_frame";
import DelayFrame from "./frames/delay_frame";
import { Frame } from "./frames/frame";
import VisualFrame from "./frames/visual_frame";

type AnimationOptions = {
  optimize?: boolean;
};

export default class Animation {
  private readonly _frames: Array<Frame> = [];

  /// Current pixels view
  private currentView: VisualFrame;
  public readonly optimize: boolean = false;

  constructor(
    public readonly animationName: string,
    public readonly ledsCount: number,
    options?: AnimationOptions
  ) {
    /// Before each animation leds are set to black color.
    /// But black color is not displayed. To set all pixels to black,
    /// you should add frame, even [DelayFrame]
    this.currentView = new VisualFrame(
      new Array(ledsCount).fill(new Color(0, 0, 0)),
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
    } else if (newFrame.pixels.length !== this.ledsCount) {
      throw new Error(
        `Unsupported frame length. ` +
          `Current: ${newFrame.pixels.length}, ` +
          `required: ${this.ledsCount}`
      );
    }

    if (this.optimize) {
      const changedPixels = AdditiveFrame.getChangedPixelsFromFrames(
        this.currentView,
        newFrame
      );

      const noPixelsChanges = changedPixels.length === 0;

      if (noPixelsChanges) {
        this._frames.push(new DelayFrame(newFrame.duration));
      } else {
        const additiveFrame = new AdditiveFrame(
          changedPixels,
          newFrame.duration
        );
        const isAdditiveFrameSmaller =
          additiveFrame.fileDataBytes < newFrame.fileDataBytes;
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

  public getEncodedAnimationName = (): Uint8Array => {
    const encoder = new TextEncoder();
    const encodedName = encoder.encode(this.animationName);
    const encodednNameWithNullChar = new Uint8Array(encodedName.length + 1);
    encodednNameWithNullChar.set(encodedName);
    const NULL_CHAR = 0;
    encodednNameWithNullChar[encodedName.length] = NULL_CHAR;
    return encodednNameWithNullChar;
  };

  public get fileDataBytes(): number {
    let size = 0;
    for (let i = 0; i < this._frames.length; i++) {
      const frame = this._frames[i];
      size += frame.fileDataBytes;
    }
    const NULL_CHAR_BYTE_COUNT = 1;
    const nameSize = this.animationName.length + NULL_CHAR_BYTE_COUNT;
    return size + nameSize;
  }

  toFileData = (): Uint8Array => {
    if (this._frames.length === 0) {
      throw new Error("Animation is empty.");
    }

    const data = new Uint8Array(this.fileDataBytes);

    const encodedName = this.getEncodedAnimationName();
    const nameSize = encodedName.length;
    data.set(encodedName);

    let offset = nameSize;
    for (const frame of this._frames) {
      const frameBytes = frame.toFileData();
      const frameSize = frame.fileDataBytes;

      data.set(frameBytes, offset);

      offset += frameSize;
    }

    return data;
  };

  toFile = async (path: string = `./${this.animationName}.anim`) => {
    const stream = fs.createWriteStream(path, { encoding: "binary" });

    await new Promise<void>((res, rej) =>
      stream.write(this.getEncodedAnimationName(), (err) => {
        if (err) rej(err);
        res();
      })
    );

    for (const frame of this._frames) {
      const frameBytes = frame.toFileData();

      await new Promise<void>((res, rej) =>
        stream.write(frameBytes, (err) => {
          if (err) rej(err);
          res();
        })
      );
    }
  };
}
