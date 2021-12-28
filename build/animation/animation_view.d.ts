import { Color, VisualFrame } from "..";
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
    /**
     *  Convert to bytes that can be send over serial (skip duration)
     */
    toBytes: () => Uint8Array;
}
