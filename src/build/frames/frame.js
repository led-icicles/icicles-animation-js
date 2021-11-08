"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Frame = exports.FrameType = void 0;
var FrameType;
(function (FrameType) {
    /// [(1)type][(2)duration]
    FrameType[FrameType["DelayFrame"] = 1] = "DelayFrame";
    /// [(1)type][(2)duration][(ledsCount*3)pixels]
    FrameType[FrameType["VisualFrame"] = 2] = "VisualFrame";
    /// [(1 - uint8)type][(2 - uint16)duration][(2 - uint16)changedPixelsCount][(x)changedPixels]
    ///
    /// Changed pixels are described by:
    /// [(2 - uint16)pixel_index][(1 -uint8)red][(1 -uint8)green][(1 -uint8)blue]
    /// Therefore it is possible to index `65535` pixels (leds)
    FrameType[FrameType["AdditiveFrame"] = 3] = "AdditiveFrame";
})(FrameType = exports.FrameType || (exports.FrameType = {}));
class Frame {
    constructor(duration) {
        this.duration = duration;
        if (typeof duration !== "number" || duration > Frame.maxDuration) {
            throw new Error("Not valid duration provided. Duration should be larger or equal 0 and smaller than [Frame.maxDuration].");
        }
    }
}
exports.Frame = Frame;
Frame.maxDuration = 65535;
