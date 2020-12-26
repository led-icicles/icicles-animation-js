"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Colors = exports.IndexedColor = exports.Color = void 0;
var Color = /** @class */ (function () {
    function Color(red, green, blue) {
        var _this = this;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.toJson = function () { return ({
            r: _this.red,
            g: _this.green,
            b: _this.blue,
        }); };
        this.notEquals = function (color) { return !_this.equals(color); };
        this.equals = function (color) {
            return _this.red === color.red &&
                _this.green === color.green &&
                _this.blue === color.blue;
        };
        this.toIndexedColor = function (index) {
            return new IndexedColor(index, _this);
        };
        this.darken = function (progress) {
            return Color.linearBlend(_this, new Color(0, 0, 0), progress);
        };
    }
    Color.linearBlend = function (left, right, progress) {
        return new Color(left.red + (right.red - left.red) * progress, left.green + (right.green - left.green) * progress, left.blue + (right.blue - left.blue) * progress);
    };
    return Color;
}());
exports.Color = Color;
var IndexedColor = /** @class */ (function () {
    function IndexedColor(index, color) {
        this.index = index;
        this.color = color;
    }
    return IndexedColor;
}());
exports.IndexedColor = IndexedColor;
/// Contains predefined colors that are used on icicles controler.
var Colors = /** @class */ (function () {
    function Colors() {
        this.getRandomColor = function () {
            return Colors.colors[Math.floor(Math.random() * Colors.colors.length)];
        };
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
    return Colors;
}());
exports.Colors = Colors;
exports.default = Color;
