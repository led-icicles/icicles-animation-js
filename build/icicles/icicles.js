"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var color_1 = __importDefault(require("./color"));
var visual_frame_1 = __importDefault(require("./frames/visual_frame"));
var Icicles = /** @class */ (function () {
    function Icicles(iciclesCount, ledsPerIcicle) {
        var _this = this;
        this.iciclesCount = iciclesCount;
        this.ledsPerIcicle = ledsPerIcicle;
        this.getPixelIndex = function (icicle, led) {
            return icicle * _this.ledsPerIcicle + led;
        };
        this.setPixelColor = function (icicle, led, color) {
            var index = _this.getPixelIndex(icicle, led);
            _this.pixels[index] = color;
        };
        this.setIcicleColor = function (icicle, color) {
            var index = _this.getPixelIndex(icicle, 0);
            for (var i = index; i < index + _this.ledsPerIcicle; i++) {
                _this.pixels[i] = color;
            }
        };
        this.setPixelColorAtIndex = function (index, color) {
            _this.pixels[index] = color;
        };
        this.getPixelColor = function (icicle, led) {
            var index = _this.getPixelIndex(icicle, led);
            return _this.pixels[index];
        };
        this.setAllPixelsColor = function (color) {
            _this.pixels.fill(color);
        };
        this.setPixels = function (pixels) {
            var _a;
            if (_this.pixels.length !== pixels.length) {
                throw new Error("Unsupported pixels count");
            }
            _this.pixels.length = 0;
            (_a = _this.pixels).push.apply(_a, pixels);
        };
        this.toFrame = function (duration) {
            var copiedPixels = _this.pixels.slice(0);
            return new visual_frame_1.default(copiedPixels, duration);
        };
        this.pixels = new Array(iciclesCount * ledsPerIcicle).fill(new color_1.default(0, 0, 0));
    }
    return Icicles;
}());
exports.default = Icicles;
