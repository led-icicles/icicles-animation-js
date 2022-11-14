export abstract class Curve {
  public abstract transform(value: number): number;
}
export class Cubic extends Curve {
  constructor(
    public readonly a: number,
    public readonly b: number,
    public readonly c: number,
    public readonly d: number
  ) {
    super();
  }

  private static _cubicErrorBound: number = 0.001;

  private _evaluateCubic(a: number, b: number, m: number): number {
    return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m;
  }

  public transform(value: number): number {
    let start = 0.0;
    let end = 1.0;
    while (true) {
      const midpoint = (start + end) / 2;
      const estimate = this._evaluateCubic(this.a, this.c, midpoint);
      if (Math.abs(value - estimate) < Cubic._cubicErrorBound)
        return this._evaluateCubic(this.b, this.d, midpoint);
      if (estimate < value) start = midpoint;
      else end = midpoint;
    }
  }
}

export class ElasticInCurve extends Curve {
  constructor(public readonly period: number = 0.4) {
    super();
  }

  public transform(value: number): number {
    const s = this.period / 4.0;
    value = value - 1.0;
    return (
      -Math.pow(2.0, 10.0 * value) *
      Math.sin(((value - s) * (Math.PI * 2.0)) / this.period)
    );
  }
}

export class ElasticOutCurve extends Curve {
  constructor(public readonly period: number = 0.4) {
    super();
  }

  public transform(value: number): number {
    const s = this.period / 4.0;
    return (
      Math.pow(2.0, -10 * value) *
        Math.sin(((value - s) * (Math.PI * 2.0)) / this.period) +
      1.0
    );
  }
}

export class ElasticInOutCurve extends Curve {
  constructor(public readonly period: number = 0.4) {
    super();
  }

  public transform(value: number): number {
    const s = this.period / 4.0;
    value = 2.0 * value - 1.0;
    if (value < 0.0)
      return (
        -0.5 *
        Math.pow(2.0, 10.0 * value) *
        Math.sin(((value - s) * (Math.PI * 2.0)) / this.period)
      );
    else
      return (
        Math.pow(2.0, -10.0 * value) *
          Math.sin(((value - s) * (Math.PI * 2.0)) / this.period) *
          0.5 +
        1.0
      );
  }
}

export abstract class BounceCurve extends Curve {
  protected bounce(value: number): number {
    if (value < 1.0 / 2.75) {
      return 7.5625 * value * value;
    } else if (value < 2 / 2.75) {
      value -= 1.5 / 2.75;
      return 7.5625 * value * value + 0.75;
    } else if (value < 2.5 / 2.75) {
      value -= 2.25 / 2.75;
      return 7.5625 * value * value + 0.9375;
    }
    value -= 2.625 / 2.75;
    return 7.5625 * value * value + 0.984375;
  }
}

export class BounceInCurve extends BounceCurve {
  public transform(value: number) {
    return 1.0 - this.bounce(1.0 - value);
  }
}

export class BounceOutCurve extends BounceCurve {
  public transform(value: number) {
    return this.bounce(value);
  }
}

export class BounceInOutCurve extends BounceCurve {
  public transform(value: number) {
    if (value < 0.5) {
      return (1.0 - this.bounce(1.0 - value * 2.0)) * 0.5;
    } else {
      return this.bounce(value * 2.0 - 1.0) * 0.5 + 0.5;
    }
  }
}

export class DecelerateCurve extends Curve {
  public transform(value: number) {
    value = 1.0 - value;
    return 1.0 - value * value;
  }
}

export abstract class Curves {
  private constructor() {}

  static readonly fastLinearToSlowEaseIn = new Cubic(0.18, 1.0, 0.04, 1.0);
  static readonly ease = new Cubic(0.25, 0.1, 0.25, 1.0);
  static readonly easeIn = new Cubic(0.42, 0.0, 1.0, 1.0);
  static readonly easeInToLinear = new Cubic(0.67, 0.03, 0.65, 0.09);
  static readonly easeInSine = new Cubic(0.47, 0.0, 0.745, 0.715);
  static readonly easeInQuad = new Cubic(0.55, 0.085, 0.68, 0.53);
  static readonly easeInCubic = new Cubic(0.55, 0.055, 0.675, 0.19);
  static readonly easeInQuart = new Cubic(0.895, 0.03, 0.685, 0.22);
  static readonly easeInQuint = new Cubic(0.755, 0.05, 0.855, 0.06);
  static readonly easeInExpo = new Cubic(0.95, 0.05, 0.795, 0.035);
  static readonly easeInCirc = new Cubic(0.6, 0.04, 0.98, 0.335);
  static readonly easeInBack = new Cubic(0.6, -0.28, 0.735, 0.045);
  static readonly easeOut = new Cubic(0.0, 0.0, 0.58, 1.0);
  static readonly linearToEaseOut = new Cubic(0.35, 0.91, 0.33, 0.97);
  static readonly easeOutSine = new Cubic(0.39, 0.575, 0.565, 1.0);
  static readonly easeOutQuad = new Cubic(0.25, 0.46, 0.45, 0.94);
  static readonly easeOutCubic = new Cubic(0.215, 0.61, 0.355, 1.0);
  static readonly easeOutQuart = new Cubic(0.165, 0.84, 0.44, 1.0);
  static readonly easeOutQuint = new Cubic(0.23, 1.0, 0.32, 1.0);
  static readonly easeOutExpo = new Cubic(0.19, 1.0, 0.22, 1.0);
  static readonly easeOutCirc = new Cubic(0.075, 0.82, 0.165, 1.0);
  static readonly easeOutBack = new Cubic(0.175, 0.885, 0.32, 1.275);
  static readonly easeInOut = new Cubic(0.42, 0.0, 0.58, 1.0);
  static readonly easeInOutSine = new Cubic(0.445, 0.05, 0.55, 0.95);
  static readonly easeInOutQuad = new Cubic(0.455, 0.03, 0.515, 0.955);
  static readonly easeInOutCubic = new Cubic(0.645, 0.045, 0.355, 1.0);
  static readonly easeInOutQuart = new Cubic(0.77, 0.0, 0.175, 1.0);
  static readonly easeInOutQuint = new Cubic(0.86, 0.0, 0.07, 1.0);
  static readonly easeInOutExpo = new Cubic(1.0, 0.0, 0.0, 1.0);
  static readonly easeInOutCirc = new Cubic(0.785, 0.135, 0.15, 0.86);
  static readonly easeInOutBack = new Cubic(0.68, -0.55, 0.265, 1.55);
  static readonly fastOutSlowIn = new Cubic(0.4, 0.0, 0.2, 1.0);
  static readonly slowMiddle = new Cubic(0.15, 0.85, 0.85, 0.15);

  static readonly decelerate = new DecelerateCurve();
  static readonly bounceIn = new BounceInCurve();
  static readonly bounceOut = new BounceOutCurve();
  static readonly bounceInOut = new BounceInOutCurve();
  static readonly elasticIn = new ElasticInCurve();
  static readonly elasticOut = new ElasticOutCurve();
  static readonly elasticInOut = new ElasticInOutCurve();
}
