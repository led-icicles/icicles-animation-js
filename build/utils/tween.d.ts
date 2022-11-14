export declare class Tween {
    readonly begin: number;
    readonly end: number;
    constructor(begin: number, end: number);
    lerp(t: number): number;
    transform(t: number): number;
}
