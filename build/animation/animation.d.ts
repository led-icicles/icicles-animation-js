/// <reference types="node" />
import { AnimationHeader, AnimationHeaderData } from "./animation_header";
import { Frame } from "../frames/frame";
import { VisualFrame } from "../frames/visual_frame";
export declare type AnimationOptions = {
    optimize?: boolean;
};
export declare class Animation {
    private readonly _frames;
    get frames(): Array<Frame>;
    private readonly _header;
    get header(): AnimationHeader;
    play(): Generator<VisualFrame, void, VisualFrame>;
    private _currentView;
    readonly optimize: boolean;
    constructor(options: AnimationOptions & AnimationHeaderData);
    addFrame: (newFrame: Frame) => void;
    get duration(): number;
    get animationFramesCount(): number;
    get size(): number;
    toBytes: () => Uint8Array;
    toFile: (path: string) => Promise<void>;
    static fromFile: (path: string) => Promise<Animation>;
    static decode: (buffer: Buffer) => Promise<Animation>;
}