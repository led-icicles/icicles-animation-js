import { Color } from "../utils/color";
import { VisualFrame } from "../frames/visual_frame";
import { Duration, Animation } from "..";
export declare class Icicles {
    readonly animation: Animation;
    private readonly _pixels;
    get pixels(): Array<Color>;
    get xCount(): number;
    get yCount(): number;
    constructor(animation: Animation);
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
    /**
     * When setting `duration` to any value other than 0ms, the panel color will be displayed
     * immediately and the next frame will be delayed by the specified time.
     *
     * Skipping the `duration` will cause the radio panel colors to be displayed
     * together with the `show` method invocation.
     */
    setRadioPanelColor(panelIndex: number, color: Color, duration?: Duration): void;
    show(duration: Duration): void;
}
