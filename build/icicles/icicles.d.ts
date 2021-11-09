import { Color } from "../utils/color";
import { VisualFrame } from "../frames/visual_frame";
import { Duration } from "..";
export declare class Icicles {
    readonly xCount: number;
    readonly yCount: number;
    readonly pixels: Array<Color>;
    constructor(xCount: number, yCount: number);
    private _isValidIndex;
    getPixelIndex: (x: number, y: number) => number;
    getPixelColor: (x: number, y: number) => Color;
    getPixelColorAtIndex: (index: number) => Color;
    setPixelColor: (x: number, y: number, color: Color) => void;
    setColumnColor: (x: number, color: Color) => void;
    setRowColor: (y: number, color: Color) => void;
    setPixelColorAtIndex: (index: number, color: Color) => void;
    setAllPixelsColor: (color: Color) => void;
    setPixels: (pixels: Array<Color>) => void;
    toFrame: (duration: Duration) => VisualFrame;
}
