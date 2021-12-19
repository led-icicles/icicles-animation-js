"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationView = exports.RadioPanelView = void 0;
const __1 = require("..");
var SerialMessageTypes;
(function (SerialMessageTypes) {
    /**
     * Keep leds aware of ongoing serial communication.
     *
     * Built-in animations are stopped.
     */
    SerialMessageTypes[SerialMessageTypes["ping"] = 0] = "ping";
    // display following frame
    SerialMessageTypes[SerialMessageTypes["displayView"] = 1] = "displayView";
    /**
     * End serial communication and start playing built-in animations
     */
    SerialMessageTypes[SerialMessageTypes["end"] = 10] = "end";
})(SerialMessageTypes || (SerialMessageTypes = {}));
class RadioPanelView {
    constructor(index, color) {
        this.index = index;
        this.color = color;
        this.copyWith = ({ index, color, } = {}) => new RadioPanelView(index !== null && index !== void 0 ? index : this.index, color !== null && color !== void 0 ? color : this.color);
    }
}
exports.RadioPanelView = RadioPanelView;
class AnimationView {
    constructor(frame, radioPanels) {
        this.frame = frame;
        this.radioPanels = radioPanels;
        this.copyWith = ({ frame, radioPanels, } = {}) => new AnimationView(frame !== null && frame !== void 0 ? frame : this.frame, radioPanels !== null && radioPanels !== void 0 ? radioPanels : this.radioPanels.slice(0));
        /**
         *  Convert to bytes that can be send over serial (skip duration)
         */
        this.toBytes = () => {
            const getRadioPanelSize = () => {
                const panelIndexSize = __1.UINT_8_SIZE_IN_BYTES;
                const color = __1.UINT_8_SIZE_IN_BYTES * 3;
                return panelIndexSize + color;
            };
            const getFrameSize = () => {
                const colorsSize = this.frame.pixels.length * 3;
                // During serial communication frame duration and type is redundant;
                return colorsSize;
            };
            const radioPanelSize = getRadioPanelSize();
            const radioPanelsSize = radioPanelSize * this.radioPanels.length;
            const frameSize = getFrameSize();
            const messageTypeSize = __1.UINT_8_SIZE_IN_BYTES;
            const viewSize = messageTypeSize + frameSize + radioPanelsSize;
            const bytes = new Uint8Array(viewSize);
            let pointer = 0;
            // Set message type
            bytes[pointer++] = SerialMessageTypes.displayView;
            /// frame pixels
            const pixels = this.frame.pixels;
            for (let i = 0; i < pixels.length; i++) {
                bytes[pointer++] = pixels[i].red;
                bytes[pointer++] = pixels[i].green;
                bytes[pointer++] = pixels[i].blue;
            }
            /// encode radio panels
            for (let i = 0; i < this.radioPanels.length; i++) {
                const radioPanelView = this.radioPanels[i];
                /// panel index
                bytes[pointer++] = radioPanelView.index;
                /// color
                bytes[pointer++] = radioPanelView.color.red;
                bytes[pointer++] = radioPanelView.color.green;
                bytes[pointer++] = radioPanelView.color.blue;
            }
            return bytes;
        };
    }
}
exports.AnimationView = AnimationView;
