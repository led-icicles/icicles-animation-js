import { Color } from "../utils/color";
import { Frame, FrameType } from "./frame";
import { VisualFrameRgb565 } from "./visual_frame_rgb565";
export declare class VisualFrame extends Frame {
    readonly pixels: Array<Color>;
    readonly duration: number;
    readonly type: FrameType;
    constructor(pixels: Array<Color>, duration: number);
    static filled(pixels: number, color: Color, duration: number): VisualFrame;
    static assertVisualFramesCompatibility: (prevFrame: VisualFrame, nextFrame: VisualFrame) => void;
    copy: () => VisualFrame;
    copyWith: ({ duration, pixels, }?: {
        duration?: number | undefined;
        pixels?: Color[] | undefined;
    }) => VisualFrame;
    get size(): number;
    static linearBlend: (from: VisualFrame, to: VisualFrame, progress: number, duration?: number | undefined) => VisualFrame;
    darken: (progress: number, duration?: number | undefined) => VisualFrame;
    toRgb565(): VisualFrameRgb565;
    toBytes: () => Uint8Array;
}
