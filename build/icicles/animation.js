"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var util_1 = require("util");
var color_1 = __importDefault(require("./color"));
var additive_frame_1 = __importDefault(require("./frames/additive_frame"));
var delay_frame_1 = __importDefault(require("./frames/delay_frame"));
var visual_frame_1 = __importDefault(require("./frames/visual_frame"));
var Animation = /** @class */ (function () {
    function Animation(animationName, ledsCount, options) {
        var _this = this;
        var _a;
        this.animationName = animationName;
        this.ledsCount = ledsCount;
        this._frames = [];
        this.optimize = false;
        this.addFrame = function (newFrame) {
            if (!newFrame) {
                throw new Error("Frame was not provided.");
            }
            else if (!(newFrame instanceof visual_frame_1.default)) {
                throw new Error("Unsupported frame type.");
            }
            else if (newFrame.pixels.length !== _this.ledsCount) {
                throw new Error("Unsupported frame length. " +
                    ("Current: " + newFrame.pixels.length + ", ") +
                    ("required: " + _this.ledsCount));
            }
            if (_this.optimize) {
                var changedPixels = additive_frame_1.default.getChangedPixelsFromFrames(_this.currentView, newFrame);
                var noPixelsChanges = changedPixels.length === 0;
                if (noPixelsChanges) {
                    _this._frames.push(new delay_frame_1.default(newFrame.duration));
                }
                else {
                    var additiveFrame = new additive_frame_1.default(changedPixels, newFrame.duration);
                    var isAdditiveFrameSmaller = additiveFrame.fileDataBytes < newFrame.fileDataBytes;
                    if (isAdditiveFrameSmaller) {
                        _this._frames.push(additiveFrame);
                    }
                    else {
                        _this._frames.push(newFrame);
                    }
                }
            }
            else {
                _this._frames.push(newFrame);
            }
            /// set current view
            _this.currentView = newFrame;
        };
        this.getEncodedAnimationName = function () {
            var encoder = new util_1.TextEncoder();
            var encodedName = encoder.encode(_this.animationName);
            var encodednNameWithNullChar = new Uint8Array(encodedName.length + 1);
            encodednNameWithNullChar.set(encodedName);
            var NULL_CHAR = 0;
            encodednNameWithNullChar[encodedName.length] = NULL_CHAR;
            return encodednNameWithNullChar;
        };
        this.toFileData = function () {
            if (_this._frames.length === 0) {
                throw new Error("Animation is empty.");
            }
            var data = new Uint8Array(_this.fileDataBytes);
            var encodedName = _this.getEncodedAnimationName();
            var nameSize = encodedName.length;
            data.set(encodedName);
            var offset = nameSize;
            for (var _i = 0, _a = _this._frames; _i < _a.length; _i++) {
                var frame = _a[_i];
                var frameBytes = frame.toFileData();
                var frameSize = frame.fileDataBytes;
                data.set(frameBytes, offset);
                offset += frameSize;
            }
            return data;
        };
        this.toFile = function (path) {
            if (path === void 0) { path = "./" + _this.animationName + ".anim"; }
            return __awaiter(_this, void 0, void 0, function () {
                var stream, _loop_1, _i, _a, frame;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            stream = fs_1.default.createWriteStream(path, { encoding: "binary" });
                            return [4 /*yield*/, new Promise(function (res, rej) {
                                    return stream.write(_this.getEncodedAnimationName(), function (err) {
                                        if (err)
                                            rej(err);
                                        res();
                                    });
                                })];
                        case 1:
                            _b.sent();
                            _loop_1 = function (frame) {
                                var frameBytes;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            frameBytes = frame.toFileData();
                                            return [4 /*yield*/, new Promise(function (res, rej) {
                                                    return stream.write(frameBytes, function (err) {
                                                        if (err)
                                                            rej(err);
                                                        res();
                                                    });
                                                })];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            _i = 0, _a = this._frames;
                            _b.label = 2;
                        case 2:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            frame = _a[_i];
                            return [5 /*yield**/, _loop_1(frame)];
                        case 3:
                            _b.sent();
                            _b.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /// Before each animation leds are set to black color.
        /// But black color is not displayed. To set all pixels to black,
        /// you should add frame, even [DelayFrame]
        this.currentView = new visual_frame_1.default(new Array(ledsCount).fill(new color_1.default(0, 0, 0)), 
        /// zero duration - this is just a placeholder
        0);
        if (options) {
            this.optimize = (_a = options.optimize) !== null && _a !== void 0 ? _a : false;
        }
    }
    Object.defineProperty(Animation.prototype, "fileDataBytes", {
        get: function () {
            var size = 0;
            for (var i = 0; i < this._frames.length; i++) {
                var frame = this._frames[i];
                size += frame.fileDataBytes;
            }
            var NULL_CHAR_BYTE_COUNT = 1;
            var nameSize = this.animationName.length + NULL_CHAR_BYTE_COUNT;
            return size + nameSize;
        },
        enumerable: false,
        configurable: true
    });
    return Animation;
}());
exports.default = Animation;
