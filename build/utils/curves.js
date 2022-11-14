"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Curves = exports.DecelerateCurve = exports.BounceInOutCurve = exports.BounceOutCurve = exports.BounceInCurve = exports.BounceCurve = exports.ElasticInOutCurve = exports.ElasticOutCurve = exports.ElasticInCurve = exports.Cubic = exports.Curve = void 0;
class Curve {
}
exports.Curve = Curve;
class Cubic extends Curve {
    constructor(a, b, c, d) {
        super();
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
    }
    _evaluateCubic(a, b, m) {
        return 3 * a * (1 - m) * (1 - m) * m + 3 * b * (1 - m) * m * m + m * m * m;
    }
    transform(value) {
        let start = 0.0;
        let end = 1.0;
        while (true) {
            const midpoint = (start + end) / 2;
            const estimate = this._evaluateCubic(this.a, this.c, midpoint);
            if (Math.abs(value - estimate) < Cubic._cubicErrorBound)
                return this._evaluateCubic(this.b, this.d, midpoint);
            if (estimate < value)
                start = midpoint;
            else
                end = midpoint;
        }
    }
}
exports.Cubic = Cubic;
Cubic._cubicErrorBound = 0.001;
class ElasticInCurve extends Curve {
    constructor(period = 0.4) {
        super();
        this.period = period;
    }
    transform(value) {
        const s = this.period / 4.0;
        value = value - 1.0;
        return (-Math.pow(2.0, 10.0 * value) *
            Math.sin(((value - s) * (Math.PI * 2.0)) / this.period));
    }
}
exports.ElasticInCurve = ElasticInCurve;
class ElasticOutCurve extends Curve {
    constructor(period = 0.4) {
        super();
        this.period = period;
    }
    transform(value) {
        const s = this.period / 4.0;
        return (Math.pow(2.0, -10 * value) *
            Math.sin(((value - s) * (Math.PI * 2.0)) / this.period) +
            1.0);
    }
}
exports.ElasticOutCurve = ElasticOutCurve;
class ElasticInOutCurve extends Curve {
    constructor(period = 0.4) {
        super();
        this.period = period;
    }
    transform(value) {
        const s = this.period / 4.0;
        value = 2.0 * value - 1.0;
        if (value < 0.0)
            return (-0.5 *
                Math.pow(2.0, 10.0 * value) *
                Math.sin(((value - s) * (Math.PI * 2.0)) / this.period));
        else
            return (Math.pow(2.0, -10.0 * value) *
                Math.sin(((value - s) * (Math.PI * 2.0)) / this.period) *
                0.5 +
                1.0);
    }
}
exports.ElasticInOutCurve = ElasticInOutCurve;
class BounceCurve extends Curve {
    bounce(value) {
        if (value < 1.0 / 2.75) {
            return 7.5625 * value * value;
        }
        else if (value < 2 / 2.75) {
            value -= 1.5 / 2.75;
            return 7.5625 * value * value + 0.75;
        }
        else if (value < 2.5 / 2.75) {
            value -= 2.25 / 2.75;
            return 7.5625 * value * value + 0.9375;
        }
        value -= 2.625 / 2.75;
        return 7.5625 * value * value + 0.984375;
    }
}
exports.BounceCurve = BounceCurve;
class BounceInCurve extends BounceCurve {
    transform(value) {
        return 1.0 - this.bounce(1.0 - value);
    }
}
exports.BounceInCurve = BounceInCurve;
class BounceOutCurve extends BounceCurve {
    transform(value) {
        return this.bounce(value);
    }
}
exports.BounceOutCurve = BounceOutCurve;
class BounceInOutCurve extends BounceCurve {
    transform(value) {
        if (value < 0.5) {
            return (1.0 - this.bounce(1.0 - value * 2.0)) * 0.5;
        }
        else {
            return this.bounce(value * 2.0 - 1.0) * 0.5 + 0.5;
        }
    }
}
exports.BounceInOutCurve = BounceInOutCurve;
class DecelerateCurve extends Curve {
    transform(value) {
        value = 1.0 - value;
        return 1.0 - value * value;
    }
}
exports.DecelerateCurve = DecelerateCurve;
class Curves {
    constructor() { }
}
exports.Curves = Curves;
Curves.fastLinearToSlowEaseIn = new Cubic(0.18, 1.0, 0.04, 1.0);
Curves.ease = new Cubic(0.25, 0.1, 0.25, 1.0);
Curves.easeIn = new Cubic(0.42, 0.0, 1.0, 1.0);
Curves.easeInToLinear = new Cubic(0.67, 0.03, 0.65, 0.09);
Curves.easeInSine = new Cubic(0.47, 0.0, 0.745, 0.715);
Curves.easeInQuad = new Cubic(0.55, 0.085, 0.68, 0.53);
Curves.easeInCubic = new Cubic(0.55, 0.055, 0.675, 0.19);
Curves.easeInQuart = new Cubic(0.895, 0.03, 0.685, 0.22);
Curves.easeInQuint = new Cubic(0.755, 0.05, 0.855, 0.06);
Curves.easeInExpo = new Cubic(0.95, 0.05, 0.795, 0.035);
Curves.easeInCirc = new Cubic(0.6, 0.04, 0.98, 0.335);
Curves.easeInBack = new Cubic(0.6, -0.28, 0.735, 0.045);
Curves.easeOut = new Cubic(0.0, 0.0, 0.58, 1.0);
Curves.linearToEaseOut = new Cubic(0.35, 0.91, 0.33, 0.97);
Curves.easeOutSine = new Cubic(0.39, 0.575, 0.565, 1.0);
Curves.easeOutQuad = new Cubic(0.25, 0.46, 0.45, 0.94);
Curves.easeOutCubic = new Cubic(0.215, 0.61, 0.355, 1.0);
Curves.easeOutQuart = new Cubic(0.165, 0.84, 0.44, 1.0);
Curves.easeOutQuint = new Cubic(0.23, 1.0, 0.32, 1.0);
Curves.easeOutExpo = new Cubic(0.19, 1.0, 0.22, 1.0);
Curves.easeOutCirc = new Cubic(0.075, 0.82, 0.165, 1.0);
Curves.easeOutBack = new Cubic(0.175, 0.885, 0.32, 1.275);
Curves.easeInOut = new Cubic(0.42, 0.0, 0.58, 1.0);
Curves.easeInOutSine = new Cubic(0.445, 0.05, 0.55, 0.95);
Curves.easeInOutQuad = new Cubic(0.455, 0.03, 0.515, 0.955);
Curves.easeInOutCubic = new Cubic(0.645, 0.045, 0.355, 1.0);
Curves.easeInOutQuart = new Cubic(0.77, 0.0, 0.175, 1.0);
Curves.easeInOutQuint = new Cubic(0.86, 0.0, 0.07, 1.0);
Curves.easeInOutExpo = new Cubic(1.0, 0.0, 0.0, 1.0);
Curves.easeInOutCirc = new Cubic(0.785, 0.135, 0.15, 0.86);
Curves.easeInOutBack = new Cubic(0.68, -0.55, 0.265, 1.55);
Curves.fastOutSlowIn = new Cubic(0.4, 0.0, 0.2, 1.0);
Curves.slowMiddle = new Cubic(0.15, 0.85, 0.85, 0.15);
Curves.decelerate = new DecelerateCurve();
Curves.bounceIn = new BounceInCurve();
Curves.bounceOut = new BounceOutCurve();
Curves.bounceInOut = new BounceInOutCurve();
Curves.elasticIn = new ElasticInCurve();
Curves.elasticOut = new ElasticOutCurve();
Curves.elasticInOut = new ElasticInOutCurve();
