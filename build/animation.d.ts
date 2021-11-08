/// <reference types="node" />
import { AnimationHeaderData } from "./animation/animation_header";
import { Frame } from "./frames/frame";
export declare type AnimationOptions = {
    optimize?: boolean;
};
export default class Animation {
    private readonly _frames;
    private readonly _header;
    private currentView;
    readonly optimize: boolean;
    constructor(options: AnimationOptions & AnimationHeaderData);
    addFrame: (newFrame: Frame) => void;
    get size(): number;
    toBytes: () => Uint8Array;
    toFile: (path: string) => Promise<void>;
    static fromFile: (path: string) => Promise<Animation>;
    static decode: (buffer: Buffer) => Promise<Animation>;
}
