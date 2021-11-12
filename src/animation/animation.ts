import { AnimationHeader, AnimationHeaderData } from "./animation_header";
import { Color, IndexedColor } from "../utils/color";
import { Frame, FrameType } from "../frames/frame";
import { UINT_16_SIZE_IN_BYTES } from "../utils/sizes";
import { DelayFrame } from "../frames/delay_frame";
import { VisualFrame } from "../frames/visual_frame";
import { AdditiveFrame } from "../frames/additive_frame";

import type * as fsTypes from "fs";
import type * as pathTypes from "path";
import { AdditiveFrameRgb565 } from "../frames/additive_frame_rgb565";
import { VisualFrameRgb565 } from "../frames/visual_frame_rgb565";

export type AnimationOptions = {
  optimize?: boolean;
  useRgb565?: boolean;
};

export class Animation {
  private readonly _frames: Array<Frame> = [];
  public get frames(): Array<Frame> {
    return this._frames.slice(0);
  }
  private readonly _header: AnimationHeader;
  public get header(): AnimationHeader {
    return this._header;
  }

  public *play(): Generator<VisualFrame, void, VisualFrame> {
    let loop = 0;
    while (loop++ < this.header.loopsCount) {
      let currentView: VisualFrame = VisualFrame.filled(
        this.header.pixelsCount,
        new Color(0, 0, 0),
        0
      );

      for (const frame of this._frames) {
        if (frame instanceof VisualFrame) {
          currentView = frame;
          yield frame as VisualFrame;
        } else if (frame instanceof DelayFrame) {
          currentView = currentView.copyWith({ duration: frame.duration });
          yield currentView;
        } else if (frame instanceof AdditiveFrame) {
          currentView = frame.mergeOnto(currentView);
          yield currentView;
        } else {
          throw new Error(`Unsupported frame type: "${frame.type}"`);
        }
      }
    }
  }

  /// Current pixels view
  private _currentView: VisualFrame;
  public readonly optimize: boolean = false;
  public readonly useRgb565: boolean = false;

  constructor(options: AnimationOptions & AnimationHeaderData) {
    this._header = new AnimationHeader({
      name: options.name,
      xCount: options.xCount,
      yCount: options.yCount,
      loopsCount: options.loopsCount,
      versionNumber: options.versionNumber,
    });
    /// Before each animation leds are set to black color.
    /// But black color is not displayed. To set all pixels to black,
    /// you should add frame, even [DelayFrame]
    this._currentView = new VisualFrame(
      new Array(this._header.ledsCount).fill(new Color(0, 0, 0)),
      /// zero duration - this is just a placeholder
      0
    );

    this.optimize = options.optimize ?? false;
    this.useRgb565 = options.useRgb565 ?? false;
  }

  public addFrame = (newFrame: Frame): void => {
    if (!newFrame) {
      throw new Error("Frame was not provided.");
    } else if (newFrame.duration < 16) {
      throw new Error(
        "The animation can't run faster than 60 FPS (preferred: 30 FPS). " +
          "Therefore, the inter-frame delay cannot be less than 16ms."
      );
    } else if (newFrame instanceof DelayFrame) {
      this._frames.push(newFrame);
      return;
    } else if (newFrame instanceof AdditiveFrame) {
      this._frames.push(newFrame);
      return;
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
        this._currentView,
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
    this._currentView = newFrame;
  };

  //** Animation duration in milliseconds - loops included */
  public get duration(): number {
    return (
      this._frames.reduce((p, n) => p + n.duration, 0) * this.header.loopsCount
    );
  }

  //** Animation frames count - loops are included */
  public get animationFramesCount(): number {
    return this._frames.length * this.header.loopsCount;
  }

  /// Animation size in bytes
  public get size(): number {
    let framesDataSize = 0;
    for (let i = 0; i < this._frames.length; i++) {
      const frame = this._frames[i];
      framesDataSize += frame.size;
    }

    return this._header.size + framesDataSize;
  }

  public toBytes = (): Uint8Array => {
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

  public toFile = async (path: string): Promise<void> => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
      throw new Error("This method is not supported in browser env");
    }
    let toFileStart = Date.now();

    console.log(`Creating animation file: optimize=${this.optimize}`);

    const fs: typeof fsTypes = require("fs");
    const p: typeof pathTypes = require("path");
    const targetPath = p.resolve(path);
    const targetDir = p.dirname(path);
    await fs.promises.mkdir(targetDir, { recursive: true });

    const stream = fs.createWriteStream(targetPath, { encoding: "binary" });
    try {
      console.log("===== HEADER =====");
      console.log("Writing header...");
      await new Promise<void>((res, rej) =>
        stream.write(this._header.encode(), (err) => {
          if (err) rej(err);
          res();
        })
      );
      console.log("Header written.");
      console.log("=== END HEADER ===");

      console.log(`Writing ${this._frames.length} frames...`);
      let framesToFileStart = Date.now();

      for (const frame of this._frames) {
        const frameBytes =
          frame instanceof VisualFrame || frame instanceof AdditiveFrame
            ? frame.toRgb565().toBytes()
            : frame.toBytes();

        await new Promise<void>((res, rej) =>
          stream.write(frameBytes, (err) => {
            if (err) rej(err);
            res();
          })
        );
      }

      console.log(`All frames written in ${Date.now() - framesToFileStart}ms.`);

      stream.end();

      console.log(
        `frames count: ${this._frames.length}, size: ${(
          this.size / 1000
        ).toFixed(2)} KB`
      );
      console.log(
        `File written in ${Date.now() - toFileStart}ms.  path="${targetPath}".`
      );
    } catch (err) {
      stream.destroy();
      fs.unlinkSync(targetPath);
      throw err;
    }
  };

  public static fromFile = async (path: string): Promise<Animation> => {
    const isBrowser = typeof window !== "undefined";
    if (isBrowser) {
      throw new Error("This method is not supported in browser env");
    }

    const fs: typeof fsTypes = require("fs");
    const buffer = await fs.promises.readFile(path);
    return Animation.decode(buffer);
  };

  public static decode = async (buffer: Buffer): Promise<Animation> => {
    const { header, data } = AnimationHeader.decode(buffer);

    const animation = new Animation({
      ...header,
      optimize: false,
    });

    const pixelsCount = header.pixelsCount;

    let offset = 0;
    const dataView = new DataView(data.buffer);

    while (offset < data.length) {
      const frameType: FrameType = dataView.getUint8(offset++);
      switch (frameType) {
        case FrameType.VisualFrame: {
          const duration = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;
          const endIndex = offset + pixelsCount * 3;
          const pixels: Array<Color> = [];
          for (let i = offset; i < endIndex; i += 3) {
            const color = new Color(data[i], data[i + 1], data[i + 2]);
            pixels.push(color);
          }
          offset = endIndex;

          animation.addFrame(new VisualFrame(pixels, duration));
          break;
        }
        case FrameType.VisualFrameRgb565: {
          const duration = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;

          const endIndex = offset + pixelsCount * 2;
          const pixels: Array<Color> = new Array(pixelsCount);
          let arrayIndex = 0;
          for (let i = offset; i < endIndex; i += 2) {
            const colorData = dataView.getUint16(i, true);

            const r5 = (colorData >> 11) & 0x1f;
            const g6 = (colorData >> 5) & 0x3f;
            const b5 = colorData & 0x1f;

            const r8 = (r5 * 527 + 23) >> 6;
            const g8 = (g6 * 259 + 33) >> 6;
            const b8 = (b5 * 527 + 23) >> 6;
            const color = new Color(r8, g8, b8);
            pixels[arrayIndex++] = color;
          }
          offset = endIndex;

          animation.addFrame(new VisualFrameRgb565(pixels, duration));
          break;
        }
        case FrameType.DelayFrame: {
          const duration = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;

          animation.addFrame(new DelayFrame(duration));

          break;
        }
        case FrameType.AdditiveFrame: {
          const duration = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;
          const changedPixelsCount = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;

          const endIndex = offset + changedPixelsCount * 5;
          const pixels: Array<IndexedColor> = [];
          for (let i = offset; i < endIndex; i += 5) {
            const pixelIndex = dataView.getUint16(i, true);

            const indexedColor = new IndexedColor(
              pixelIndex,
              new Color(
                data[i + UINT_16_SIZE_IN_BYTES],
                data[i + UINT_16_SIZE_IN_BYTES + 1],
                data[i + UINT_16_SIZE_IN_BYTES + 2]
              )
            );
            pixels.push(indexedColor);
          }
          offset = endIndex;

          animation.addFrame(new AdditiveFrame(pixels, duration));
          break;
        }
        case FrameType.AdditiveFrameRgb565: {
          const duration = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;
          const changedPixelsCount = dataView.getUint16(offset, true);
          offset += UINT_16_SIZE_IN_BYTES;

          const endIndex = offset + changedPixelsCount * 4;
          const pixels: Array<IndexedColor> = new Array(changedPixelsCount);

          let arrayIndex = 0;
          for (let i = offset; i < endIndex; i += 4) {
            const pixelIndex = dataView.getUint16(i, true);

            const colorData = dataView.getUint16(
              i + UINT_16_SIZE_IN_BYTES,
              true
            );

            const r5 = (colorData >> 11) & 0x1f;
            const g6 = (colorData >> 5) & 0x3f;
            const b5 = colorData & 0x1f;

            const r8 = (r5 * 527 + 23) >> 6;
            const g8 = (g6 * 259 + 33) >> 6;
            const b8 = (b5 * 527 + 23) >> 6;
            const color = new Color(r8, g8, b8);

            const indexedColor = new IndexedColor(pixelIndex, color);
            pixels[arrayIndex++] = indexedColor;
          }
          offset = endIndex;

          animation.addFrame(new AdditiveFrameRgb565(pixels, duration));
          break;
        }
        default:
          throw new Error(`Unsupported frame type: "${frameType}"`);
      }
    }

    console.log(
      `frames count: ${animation._frames.length}, size: ${(
        animation.size / 1000
      ).toFixed(2)} KB`
    );

    return animation;
  };
}
