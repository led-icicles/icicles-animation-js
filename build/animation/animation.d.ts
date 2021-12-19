/// <reference types="node" />
import { AnimationHeader, AnimationHeaderData } from "./animation_header";
import { Color } from "../utils/color";
import { Frame } from "../frames/frame";
import { VisualFrame } from "../frames/visual_frame";
export declare type AnimationOptions = {
    optimize?: boolean;
    useRgb565?: boolean;
};
export declare class RadioPanelView {
    readonly index: number;
    readonly color: Color;
    constructor(index: number, color: Color);
    copyWith: ({ index, color, }?: {
        index?: number | undefined;
        color?: Color | undefined;
    }) => RadioPanelView;
}
export declare class AnimationView {
    readonly frame: VisualFrame;
    readonly radioPanels: Array<RadioPanelView>;
    constructor(frame: VisualFrame, radioPanels: Array<RadioPanelView>);
    copyWith: ({ frame, radioPanels, }?: {
        frame?: VisualFrame | undefined;
        radioPanels?: RadioPanelView[] | undefined;
    }) => AnimationView;
}
export declare class Animation {
    private readonly _frames;
    get frames(): Array<Frame>;
    private readonly _header;
    get header(): AnimationHeader;
    play(): Generator<AnimationView, AnimationView, AnimationView>;
    protected readonly _radioPanels: Array<RadioPanelView>;
    private _currentView;
    get currentView(): VisualFrame;
    readonly optimize: boolean;
    readonly useRgb565: boolean;
    constructor(options: AnimationOptions & AnimationHeaderData);
    addFrame: (newFrame: Frame) => void;
    get duration(): number;
    get animationFramesCount(): number;
    get size(): number;
    toBytes: () => Uint8Array;
    toFile: (path: string) => Promise<void>;
    static fromFile: (path: string) => Promise<Animation>;
    static decode: (buffer: Buffer) => Promise<Animation>;
    dispose(): void;
}
