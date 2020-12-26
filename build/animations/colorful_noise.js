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
var animation_1 = __importDefault(require("../icicles/animation"));
var color_1 = require("../icicles/color");
var icicles_1 = __importDefault(require("../icicles/icicles"));
var optimize = true;
var compile = function () { return __awaiter(void 0, void 0, void 0, function () {
    var icicles, anim, generateNoiseWithColor;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                icicles = new icicles_1.default(20, 15);
                anim = new animation_1.default("Kolorowy szum", 300, { optimize: optimize });
                generateNoiseWithColor = function (color) {
                    var pixels = icicles.pixels;
                    var indexedPixels = pixels.map(function (color, index) { return new color_1.IndexedColor(index, color); });
                    /// generate noise pixel by pixel
                    while (indexedPixels.length > 0) {
                        var randomPixelIndex = Math.floor(Math.random() * indexedPixels.length);
                        var removedPixel = indexedPixels.splice(randomPixelIndex, 1)[0];
                        icicles.setPixelColorAtIndex(removedPixel.index, color);
                        anim.addFrame(icicles.toFrame(10));
                    }
                    // /// darken all pixels to 0;
                    // let progress: number = 0.0;
                    // while (progress < 1.0) {
                    //   progress += 0.01;
                    //   const newColor = color.darken(progress);
                    //   icicles.setAllPixelsColor(newColor);
                    //   anim.addFrame(icicles.toFrame(40));
                    // }
                    /// wait for second before next cycle
                    anim.addFrame(icicles.toFrame(500));
                };
                generateNoiseWithColor(color_1.Colors.white);
                generateNoiseWithColor(color_1.Colors.black);
                generateNoiseWithColor(color_1.Colors.orange);
                generateNoiseWithColor(color_1.Colors.black);
                generateNoiseWithColor(color_1.Colors.oceanBlue);
                generateNoiseWithColor(color_1.Colors.black);
                generateNoiseWithColor(color_1.Colors.magenta);
                generateNoiseWithColor(color_1.Colors.black);
                generateNoiseWithColor(color_1.Colors.red);
                generateNoiseWithColor(color_1.Colors.black);
                generateNoiseWithColor(color_1.Colors.blue);
                generateNoiseWithColor(color_1.Colors.black);
                generateNoiseWithColor(color_1.Colors.green);
                generateNoiseWithColor(color_1.Colors.black);
                return [4 /*yield*/, anim.toFile("./kolorowy-szum" + (optimize ? "-optimized" : "") + ".anim")];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
compile();
