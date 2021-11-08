export class Color {
    constructor(red, green, blue) {
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
        this.value = (red << 16) + (green << 8) + blue;
    }
    get red() {
        return (this.value & 0xff0000) >> 16;
    }
    get green() {
        return (this.value & 0x00ff00) >> 8;
    }
    get blue() {
        return this.value & 0x0000ff;
    }
}
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
export class IndexedColor {
    constructor(index, color) {
        this.index = index;
        this.color = color;
    }
}
/// Contains predefined colors that are used on icicles controler.
export class Colors {
    constructor() {
        this.getRandomColor = () => Colors.colors[Math.floor(Math.random() * Colors.colors.length)];
    }
}
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
//# sourceMappingURL=color.js.map