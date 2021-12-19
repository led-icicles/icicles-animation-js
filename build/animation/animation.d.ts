/// <reference types="node" />
import { AnimationHeader, AnimationHeaderData } from "./animation_header";
import { Frame } from "../frames/frame";
import { VisualFrame } from "../frames/visual_frame";
import { AnimationView, RadioPanelView } from "./animation_view";
export declare type AnimationOptions = {
    optimize?: boolean;
    useRgb565?: boolean;
};
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
    get framesCount(): number;
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
