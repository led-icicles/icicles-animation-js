import fs from "fs";
import VisualFrame from "./frames/visual_frame";

export default class Animation {
  private readonly _frames: Array<VisualFrame> = [];

  constructor(
    public readonly animationName: string,
    public readonly ledsCount: number
  ) {}

  addFrame = (frame: VisualFrame) => {
    if (!frame) {
      throw new Error("Frame was not provided.");
    } else if (!(frame instanceof VisualFrame)) {
      throw new Error("Unsupported frame type.");
    } else if (frame.pixels.length !== this.ledsCount) {
      throw new Error(
        `Unsupported frame length. ` +
          `Current: ${frame.pixels.length}, ` +
          `required: ${this.ledsCount}`
      );
    }

    

    this._frames.push(frame);
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
