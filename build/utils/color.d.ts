export declare type ColorJson = {
    r: number;
    g: number;
    b: number;
};
export declare class Color {
    private readonly _value;
    get value(): number;
    constructor(red: number, green: number, blue: number);
    get red(): number;
    get green(): number;
    get blue(): number;
    toJson: () => ColorJson;
    toRgb565(): number;
    notEquals: (color: Color) => boolean;
    equals: (color: Color) => boolean;
    toIndexedColor: (index: number) => IndexedColor;
    darken: (progress: number) => Color;
    static linearBlend: (left: Color, right: Color, progress: number) => Color;
}
export declare class IndexedColor {
    readonly index: number;
    readonly color: Color;
    constructor(index: number, color: Color);
}
export declare abstract class Colors {
    static readonly green: Color;
    static readonly red: Color;
    static readonly blue: Color;
    static readonly lightBlue: Color;
    static readonly yellow: Color;
    static readonly magenta: Color;
    static readonly orange: Color;
    static readonly violet: Color;
    static readonly oceanBlue: Color;
    static readonly lawnGreen: Color;
    static readonly black: Color;
    static readonly white: Color;
    static readonly colors: Color[];
    getRandomColor: () => Color;
}
