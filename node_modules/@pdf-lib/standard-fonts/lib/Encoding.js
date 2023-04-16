"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable max-classes-per-file */
var utils_1 = require("./utils");
var all_encodings_compressed_json_1 = __importDefault(require("./all-encodings.compressed.json"));
var decompressedEncodings = utils_1.decompressJson(all_encodings_compressed_json_1.default);
var allUnicodeMappings = JSON.parse(decompressedEncodings);
var Encoding = /** @class */ (function () {
    function Encoding(name, unicodeMappings) {
        var _this = this;
        this.canEncodeUnicodeCodePoint = function (codePoint) {
            return codePoint in _this.unicodeMappings;
        };
        this.encodeUnicodeCodePoint = function (codePoint) {
            var mapped = _this.unicodeMappings[codePoint];
            if (!mapped) {
                var str = String.fromCharCode(codePoint);
                var hexCode = "0x" + utils_1.padStart(codePoint.toString(16), 4, '0');
                var msg = _this.name + " cannot encode \"" + str + "\" (" + hexCode + ")";
                throw new Error(msg);
            }
            return { code: mapped[0], name: mapped[1] };
        };
        this.name = name;
        this.supportedCodePoints = Object.keys(unicodeMappings)
            .map(Number)
            .sort(function (a, b) { return a - b; });
        this.unicodeMappings = unicodeMappings;
    }
    return Encoding;
}());
exports.Encodings = {
    Symbol: new Encoding('Symbol', allUnicodeMappings.symbol),
    ZapfDingbats: new Encoding('ZapfDingbats', allUnicodeMappings.zapfdingbats),
    WinAnsi: new Encoding('WinAnsi', allUnicodeMappings.win1252),
};
