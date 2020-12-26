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
var DelayFrame = /** @class */ (function (_super) {
    __extends(DelayFrame, _super);
    function DelayFrame(duration) {
        var _this = _super.call(this, duration) || this;
        _this.duration = duration;
        _this.type = frame_1.FrameType.DelayFrame;
        _this.toFileData = function () {
            var size = _this.fileDataBytes;
            var dataPointer = 0;
            var data = new Uint8Array(size);
            /// frame header
            data[dataPointer++] = _this.type;
            /// frame duration (little endian)
            data[dataPointer++] = _this.duration & 255;
            data[dataPointer++] = _this.duration >>> 8;
            return data;
        };
        return _this;
    }
    Object.defineProperty(DelayFrame.prototype, "fileDataBytes", {
        /// [(1)type][(2)duration]
        get: function () {
            var headerSize = 1;
            var durationSize = 2;
            return headerSize + durationSize;
        },
        enumerable: false,
        configurable: true
    });
    return DelayFrame;
}(frame_1.Frame));
exports.default = DelayFrame;
