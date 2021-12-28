export declare abstract class Curve {
    abstract transform(value: number): number;
}
export declare class Cubic extends Curve {
    readonly a: number;
    readonly b: number;
    readonly c: number;
    readonly d: number;
    constructor(a: number, b: number, c: number, d: number);
    private static _cubicErrorBound;
    private _evaluateCubic;
    transform(value: number): number;
}
export declare class ElasticInCurve extends Curve {
    readonly period: number;
    constructor(period?: number);
    transform(value: number): number;
}
export declare class ElasticOutCurve extends Curve {
    readonly period: number;
    constructor(period?: number);
    transform(value: number): number;
}
export declare class ElasticInOutCurve extends Curve {
    readonly period: number;
    constructor(period?: number);
    transform(value: number): number;
}
export declare abstract class BounceCurve extends Curve {
    protected bounce(value: number): number;
}
export declare class BounceInCurve extends BounceCurve {
    transform(value: number): number;
}
export declare class BounceOutCurve extends BounceCurve {
    transform(value: number): number;
}
export declare class BounceInOutCurve extends BounceCurve {
    transform(value: number): number;
}
export declare class DecelerateCurve extends Curve {
    transform(value: number): number;
}
export declare abstract class Curves {
    private constructor();
    static readonly fastLinearToSlowEaseIn: Cubic;
    static readonly ease: Cubic;
    static readonly easeIn: Cubic;
    static readonly easeInToLinear: Cubic;
    static readonly easeInSine: Cubic;
    static readonly easeInQuad: Cubic;
    static readonly easeInCubic: Cubic;
    static readonly easeInQuart: Cubic;
    static readonly easeInQuint: Cubic;
    static readonly easeInExpo: Cubic;
    static readonly easeInCirc: Cubic;
    static readonly easeInBack: Cubic;
    static readonly easeOut: Cubic;
    static readonly linearToEaseOut: Cubic;
    static readonly easeOutSine: Cubic;
    static readonly easeOutQuad: Cubic;
    static readonly easeOutCubic: Cubic;
    static readonly easeOutQuart: Cubic;
    static readonly easeOutQuint: Cubic;
    static readonly easeOutExpo: Cubic;
    static readonly easeOutCirc: Cubic;
    static readonly easeOutBack: Cubic;
    static readonly easeInOut: Cubic;
    static readonly easeInOutSine: Cubic;
    static readonly easeInOutQuad: Cubic;
    static readonly easeInOutCubic: Cubic;
    static readonly easeInOutQuart: Cubic;
    static readonly easeInOutQuint: Cubic;
    static readonly easeInOutExpo: Cubic;
    static readonly easeInOutCirc: Cubic;
    static readonly easeInOutBack: Cubic;
    static readonly fastOutSlowIn: Cubic;
    static readonly slowMiddle: Cubic;
    static readonly decelerate: DecelerateCurve;
    static readonly bounceIn: BounceInCurve;
    static readonly bounceOut: BounceOutCurve;
    static readonly bounceInOut: BounceInOutCurve;
    static readonly elasticIn: ElasticInCurve;
    static readonly elasticOut: ElasticOutCurve;
    static readonly elasticInOut: ElasticInOutCurve;
}
