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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var frame_1 = require("./frame");
var visual_frame_1 = __importDefault(require("./visual_frame"));
var AdditiveFrame = /** @class */ (function (_super) {
    __extends(AdditiveFrame, _super);
    function AdditiveFrame(changedPixels, duration) {
        var _this = _super.call(this, duration) || this;
        _this.changedPixels = changedPixels;
        _this.duration = duration;
        _this.type = frame_1.FrameType.AdditiveFrame;
        _this.toFileData = function () {
            var size = _this.fileDataBytes;
            var dataPointer = 0;
            var data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = _this.type;
            /// frame duration (little endian)
            data[dataPointer++] = _this.duration & 255;
            data[dataPointer++] = _this.duration >>> 8;
            /// frame size (little endian)
            var changedPixelsCount = _this.changedPixels.length;
            data[dataPointer++] = changedPixelsCount & 255;
            data[dataPointer++] = changedPixelsCount >>> 8;
            /// frame pixels
            for (var i = 0; i < _this.changedPixels.length; i++) {
                var changedPixel = _this.changedPixels[i];
                var index = changedPixel.index;
                /// pixel index (little endian)
                data[dataPointer++] = index & 255;
                data[dataPointer++] = index >>> 8;
                var color = changedPixel.color;
                data[dataPointer++] = color.red;
                data[dataPointer++] = color.green;
                data[dataPointer++] = color.blue;
            }
            return data;
        };
        if (changedPixels == null) {
            throw new Error("changedPixels argument cannot be null");
        }
        else if (changedPixels.length > AdditiveFrame.maxChangedPixelIndex) {
            throw new Error("Provided more chnaged pixels than maximum allowed. Check [AdditiveFrame.maxChangedPixelIndex].");
        }
        return _this;
    }
    Object.defineProperty(AdditiveFrame.prototype, "fileDataBytes", {
        // [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)size][(x * 5)changedPixels]
        get: function () {
            var typeSize = 1;
            var durationSize = 2;
            var sizeFieldSize = 2;
            // [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
            var changedPixelsSize = this.changedPixels.length * 5;
            return typeSize + durationSize + sizeFieldSize + changedPixelsSize;
        },
        enumerable: false,
        configurable: true
    });
    AdditiveFrame.maxChangedPixelIndex = 65535;
    AdditiveFrame.getChangedPixelsFromFrames = function (prevFrame, nextFrame) {
        visual_frame_1.default.assertVisualFramesCompatibility(prevFrame, nextFrame);
        var changedPixels = [];
        for (var index = 0; index < prevFrame.pixels.length; index++) {
            var prevPixel = prevFrame.pixels[index];
            var nextPixel = nextFrame.pixels[index];
            if (nextPixel.notEquals(prevPixel)) {
                var indexedColor = nextPixel.toIndexedColor(index);
                changedPixels.push(indexedColor);
            }
        }
        return changedPixels;
    };
    AdditiveFrame.fromVisualFrames = function (prevFrame, nextFrame) {
        var changedPixels = AdditiveFrame.getChangedPixelsFromFrames(prevFrame, nextFrame);
        return new AdditiveFrame(changedPixels, nextFrame.duration);
    };
    return AdditiveFrame;
}(frame_1.Frame));
exports.default = AdditiveFrame;
