"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var animation_1 = __importDefault(require("../icicles/animation"));
var color_1 = __importDefault(require("../icicles/color"));
var icicles_1 = __importDefault(require("../icicles/icicles"));
describe("Animation works correctly", function () {
    test("Encodes name correctly", function () {
        var animation = new animation_1.default("animation", 300);
        expect(animation.getEncodedAnimationName()).toMatchInlineSnapshot("\n      Uint8Array [\n        97,\n        110,\n        105,\n        109,\n        97,\n        116,\n        105,\n        111,\n        110,\n        0,\n      ]\n    ");
    });
    test("VisualFrames works corretly", function () {
        var iciclesSize = 4;
        var icicles = new icicles_1.default(1, iciclesSize);
        var animation = new animation_1.default("animation", icicles.pixels.length, {
            optimize: false,
        });
        for (var i = 0; i < iciclesSize; i++) {
            icicles.setAllPixelsColor(new color_1.default(0, 0, 0));
            icicles.setPixelColorAtIndex(i, new color_1.default(255, 255, 255));
            animation.addFrame(icicles.toFrame(400));
        }
        expect(animation.toFileData()).toMatchSnapshot();
    });
    test("Creates AdditiveFrame corretly", function () {
        var iciclesSize = 4;
        var icicles = new icicles_1.default(1, iciclesSize);
        var animation = new animation_1.default("animation", icicles.pixels.length, {
            optimize: true,
        });
        for (var i = 0; i < iciclesSize; i++) {
            icicles.setAllPixelsColor(new color_1.default(0, 0, 0));
            icicles.setPixelColorAtIndex(i, new color_1.default(255, 255, 255));
            animation.addFrame(icicles.toFrame(400));
        }
        expect(animation.toFileData()).toMatchSnapshot();
    });
});
