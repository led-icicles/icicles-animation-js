import { Color } from "./color";
import { VisualFrame } from "./frames/visual_frame";
export declare class Icicles {
    readonly iciclesCount: number;
    readonly ledsPerIcicle: number;
    readonly pixels: Array<Color>;
    constructor(iciclesCount: number, ledsPerIcicle: number);
    getPixelIndex: (icicle: number, led: number) => number;
    setPixelColor: (icicle: number, led: number, color: Color) => void;
    setIcicleColor: (icicle: number, color: Color) => void;
    setPixelColorAtIndex: (index: number, color: Color) => void;
    getPixelColor: (icicle: number, led: number) => Color;
    setAllPixelsColor: (color: Color) => void;
    setPixels: (pixels: Array<Color>) => void;
    toFrame: (duration: number) => VisualFrame;
}
