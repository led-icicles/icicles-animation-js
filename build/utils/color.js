"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.IndexedColor = exports.Color = void 0;
const _1 = require(".");
class Color {
    constructor(red = 0, green = 0, blue = 0) {
        this.toJson = () => ({
            r: this.red,
            g: this.green,
            b: this.blue,
        });
        this.notEquals = (color) => !this.equals(color);
        this.equals = (color) => this.red === color.red &&
            this.green === color.green &&
            this.blue === color.blue;
        this.toIndexedColor = (index) => new IndexedColor(index, this);
        this.darken = (progress) => Color.linearBlend(this, new Color(0, 0, 0), progress);
        this.copyWith = ({ red, green, blue, } = {}) => new Color(red !== null && red !== void 0 ? red : this.red, green !== null && green !== void 0 ? green : this.green, blue !== null && blue !== void 0 ? blue : this.blue);
        if (red > _1.UINT_8_MAX_SIZE ||
            green > _1.UINT_8_MAX_SIZE ||
            blue > _1.UINT_8_MAX_SIZE ||
            red < 0 ||
            green < 0 ||
            blue < 0) {
            throw new Error("Color components (red, green, blue) should be larger or equal 0 but no larger than 255.");
        }
        this._value = (red << 16) + (green << 8) + blue;
    }
    get value() {
        return this._value;
    }
    get red() {
        return (this._value & 0xff0000) >> 16;
    }
    get green() {
        return (this._value & 0x00ff00) >> 8;
    }
    get blue() {
        return this._value & 0x0000ff;
    }
    toRgb565() {
        return (((this.red & 0xf8) << 8) + ((this.green & 0xfc) << 3) + (this.blue >> 3));
    }
}
exports.Color = Color;
Color.linearBlend = (left, right, progress) => {
    const MIN_PROGRESS = 0.0;
    const MAX_PROGRESS = 1.0;
    const clampedProgress = progress > MAX_PROGRESS
        ? MAX_PROGRESS
        : progress < MIN_PROGRESS
            ? MIN_PROGRESS
            : progress;
    return new Color(left.red + (right.red - left.red) * clampedProgress, left.green + (right.green - left.green) * clampedProgress, left.blue + (right.blue - left.blue) * clampedProgress);
};
class IndexedColor extends Color {
    constructor(index, color) {
        super(color.red, color.green, color.blue);
        this.index = index;
        this.copyWith = ({ red, green, blue, index, } = {}) => new IndexedColor(index !== null && index !== void 0 ? index : this.index, super.copyWith({ red, green, blue }));
    }
    toColor() {
        return new Color(this.red, this.green, this.blue);
    }
}
exports.IndexedColor = IndexedColor;
/// Contains predefined colors that are used on icicles controler.
class Colors {
    get randomColor() {
        return Colors.colors[Math.floor(Math.random() * Colors.colors.length)];
    }
}
exports.Colors = Colors;
Colors.green = new Color(0, 255, 0);
Colors.red = new Color(255, 0, 0);
Colors.blue = new Color(0, 0, 255);
Colors.lightBlue = new Color(0, 255, 255);
Colors.yellow = new Color(255, 255, 0);
Colors.magenta = new Color(255, 0, 255);
Colors.orange = new Color(255, 51, 0);
Colors.violet = new Color(60, 0, 100);
Colors.oceanBlue = new Color(0, 255, 50);
Colors.lawnGreen = new Color(80, 192, 0);
Colors.black = new Color(0, 0, 0);
Colors.white = new Color(255, 255, 255);
Colors.colors = [
    Colors.green,
    Colors.red,
    Colors.blue,
    Colors.lightBlue,
    Colors.yellow,
    Colors.magenta,
    Colors.orange,
    Colors.violet,
    Colors.oceanBlue,
    Colors.lawnGreen,
];
