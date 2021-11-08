"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.IndexedColor = exports.Color = void 0;
class Color {
    constructor(red, green, blue) {
        this.red = red;
        this.green = green;
        this.blue = blue;
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
class IndexedColor {
    constructor(index, color) {
        this.index = index;
        this.color = color;
    }
}
exports.IndexedColor = IndexedColor;
/// Contains predefined colors that are used on icicles controler.
class Colors {
    constructor() {
        this.getRandomColor = () => Colors.colors[Math.floor(Math.random() * Colors.colors.length)];
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
exports.default = Color;