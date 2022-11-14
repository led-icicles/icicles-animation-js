"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tween = void 0;
class Tween {
    constructor(begin, end) {
        this.begin = begin;
        this.end = end;
    }
    lerp(t) {
        return this.begin + (this.end - this.begin) * t;
    }
    transform(t) {
        if (t == 0.0)
            return this.begin;
        if (t == 1.0)
            return this.end;
        return this.lerp(t);
    }
}
exports.Tween = Tween;
