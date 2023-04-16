"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Courier_Bold_compressed_json_1 = __importDefault(require("./Courier-Bold.compressed.json"));
var Courier_BoldOblique_compressed_json_1 = __importDefault(require("./Courier-BoldOblique.compressed.json"));
var Courier_Oblique_compressed_json_1 = __importDefault(require("./Courier-Oblique.compressed.json"));
var Courier_compressed_json_1 = __importDefault(require("./Courier.compressed.json"));
var Helvetica_Bold_compressed_json_1 = __importDefault(require("./Helvetica-Bold.compressed.json"));
var Helvetica_BoldOblique_compressed_json_1 = __importDefault(require("./Helvetica-BoldOblique.compressed.json"));
var Helvetica_Oblique_compressed_json_1 = __importDefault(require("./Helvetica-Oblique.compressed.json"));
var Helvetica_compressed_json_1 = __importDefault(require("./Helvetica.compressed.json"));
var Times_Bold_compressed_json_1 = __importDefault(require("./Times-Bold.compressed.json"));
var Times_BoldItalic_compressed_json_1 = __importDefault(require("./Times-BoldItalic.compressed.json"));
var Times_Italic_compressed_json_1 = __importDefault(require("./Times-Italic.compressed.json"));
var Times_Roman_compressed_json_1 = __importDefault(require("./Times-Roman.compressed.json"));
var Symbol_compressed_json_1 = __importDefault(require("./Symbol.compressed.json"));
var ZapfDingbats_compressed_json_1 = __importDefault(require("./ZapfDingbats.compressed.json"));
// prettier-ignore
var compressedJsonForFontName = {
    'Courier': Courier_compressed_json_1.default,
    'Courier-Bold': Courier_Bold_compressed_json_1.default,
    'Courier-Oblique': Courier_Oblique_compressed_json_1.default,
    'Courier-BoldOblique': Courier_BoldOblique_compressed_json_1.default,
    'Helvetica': Helvetica_compressed_json_1.default,
    'Helvetica-Bold': Helvetica_Bold_compressed_json_1.default,
    'Helvetica-Oblique': Helvetica_Oblique_compressed_json_1.default,
    'Helvetica-BoldOblique': Helvetica_BoldOblique_compressed_json_1.default,
    'Times-Roman': Times_Roman_compressed_json_1.default,
    'Times-Bold': Times_Bold_compressed_json_1.default,
    'Times-Italic': Times_Italic_compressed_json_1.default,
    'Times-BoldItalic': Times_BoldItalic_compressed_json_1.default,
    'Symbol': Symbol_compressed_json_1.default,
    'ZapfDingbats': ZapfDingbats_compressed_json_1.default,
};
var FontNames;
(function (FontNames) {
    FontNames["Courier"] = "Courier";
    FontNames["CourierBold"] = "Courier-Bold";
    FontNames["CourierOblique"] = "Courier-Oblique";
    FontNames["CourierBoldOblique"] = "Courier-BoldOblique";
    FontNames["Helvetica"] = "Helvetica";
    FontNames["HelveticaBold"] = "Helvetica-Bold";
    FontNames["HelveticaOblique"] = "Helvetica-Oblique";
    FontNames["HelveticaBoldOblique"] = "Helvetica-BoldOblique";
    FontNames["TimesRoman"] = "Times-Roman";
    FontNames["TimesRomanBold"] = "Times-Bold";
    FontNames["TimesRomanItalic"] = "Times-Italic";
    FontNames["TimesRomanBoldItalic"] = "Times-BoldItalic";
    FontNames["Symbol"] = "Symbol";
    FontNames["ZapfDingbats"] = "ZapfDingbats";
})(FontNames = exports.FontNames || (exports.FontNames = {}));
var fontCache = {};
var Font = /** @class */ (function () {
    function Font() {
        var _this = this;
        this.getWidthOfGlyph = function (glyphName) {
            return _this.CharWidths[glyphName];
        };
        this.getXAxisKerningForPair = function (leftGlyphName, rightGlyphName) {
            return (_this.KernPairXAmounts[leftGlyphName] || {})[rightGlyphName];
        };
    }
    Font.load = function (fontName) {
        var cachedFont = fontCache[fontName];
        if (cachedFont)
            return cachedFont;
        var json = utils_1.decompressJson(compressedJsonForFontName[fontName]);
        var font = Object.assign(new Font(), JSON.parse(json));
        font.CharWidths = font.CharMetrics.reduce(function (acc, metric) {
            acc[metric.N] = metric.WX;
            return acc;
        }, {});
        font.KernPairXAmounts = font.KernPairs.reduce(function (acc, _a) {
            var name1 = _a[0], name2 = _a[1], width = _a[2];
            if (!acc[name1])
                acc[name1] = {};
            acc[name1][name2] = width;
            return acc;
        }, {});
        fontCache[fontName] = font;
        return font;
    };
    return Font;
}());
exports.Font = Font;
