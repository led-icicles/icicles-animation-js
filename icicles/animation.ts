import fs from "fs";
import Color from "./color";
import AdditiveFrame from "./frames/additive_frame";
import DelayFrame from "./frames/delay_frame";
import { Frame } from "./frames/frame";
import VisualFrame from "./frames/visual_frame";

type AddFrameOptions = {
  optimize?: boolean;
};

export default class Animation {
  private readonly _frames: Array<Frame> = [];

  /// Current pixels view
  private currentView: VisualFrame;

  constructor(
    public readonly animationName: string,
    public readonly ledsCount: number
  ) {
    /// Before each animation leds are set to black color.
    /// But black color is not displayed. To set all pixels to black,
    /// you should add frame, even [DelayFrame]
    this.currentView = new VisualFrame(
      new Array(ledsCount).fill(new Color(0, 0, 0)),
      /// zero duration - this is just a placeholder
      0
    );
  }

  addFrame = (
    newFrame: VisualFrame,
    { optimize = false }: AddFrameOptions = {}
  ) => {
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

    if (optimize) {
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

  toFileData = (): Uint8Array => {
    if (this._frames.length === 0) {
      throw new Error("Animation is empty.");
    }

    const framesCount = this._frames.length;
    const firstFrame = this._frames[0];
    const frameSize = firstFrame.fileDataBytes;
    const data = new Uint8Array(frameSize * framesCount);

    let offset = 0;

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
