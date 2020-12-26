"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("./frame");
var VisualFrame = /** @class */ (function (_super) {
    __extends(VisualFrame, _super);
    function VisualFrame(pixels, duration) {
        var _this = _super.call(this, duration) || this;
        _this.pixels = pixels;
        _this.duration = duration;
        _this.type = frame_1.FrameType.VisualFrame;
        /// Copy visual frame instance
        _this.copy = function () { return new VisualFrame(_this.pixels.slice(0), _this.duration); };
        _this.toFileData = function () {
            var size = _this.fileDataBytes;
            var dataPointer = 0;
            var data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = _this.type;
            /// frame duration (little endian)
            data[dataPointer++] = _this.duration & 255;
            data[dataPointer++] = _this.duration >>> 8;
            /// frame pixels
            for (var i = 0; i < _this.pixels.length; i++) {
                data[dataPointer++] = _this.pixels[i].red;
                data[dataPointer++] = _this.pixels[i].green;
                data[dataPointer++] = _this.pixels[i].blue;
            }
            return data;
        };
        return _this;
    }
    Object.defineProperty(VisualFrame.prototype, "fileDataBytes", {
        /// [(1)type][(2)duration][(ledsCount*3)pixels]
        get: function () {
            var typeSize = 1;
            var durationSize = 2;
            var colorsSize = this.pixels.length * 3;
            return typeSize + durationSize + colorsSize;
        },
        enumerable: false,
        configurable: true
    });
    /// Verify wether two visual frames are compatibility
    VisualFrame.assertVisualFramesCompatibility = function (prevFrame, nextFrame) {
        if (!(prevFrame instanceof VisualFrame) ||
            !(nextFrame instanceof VisualFrame)) {
            throw new Error("Bad frame type.");
        }
        else if (prevFrame.fileDataBytes !== nextFrame.fileDataBytes) {
            throw new Error("Frames cannot have different sizes.");
        }
    };
    return VisualFrame;
}(frame_1.Frame));
exports.default = VisualFrame;
