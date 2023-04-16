import { __awaiter, __generator } from "tslib";
import PDFDocument from "./PDFDocument";
import { CustomFontEmbedder, PDFRef, StandardFontEmbedder, } from "../core";
import { assertIs, assertOrUndefined } from "../utils";
/**
 * Represents a font that has been embedded in a [[PDFDocument]].
 */
var PDFFont = /** @class */ (function () {
    function PDFFont(ref, doc, embedder) {
        this.modified = true;
        assertIs(ref, 'ref', [[PDFRef, 'PDFRef']]);
        assertIs(doc, 'doc', [[PDFDocument, 'PDFDocument']]);
        assertIs(embedder, 'embedder', [
            [CustomFontEmbedder, 'CustomFontEmbedder'],
            [StandardFontEmbedder, 'StandardFontEmbedder'],
        ]);
        this.ref = ref;
        this.doc = doc;
        this.name = embedder.fontName;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFPage.drawText]] method will automatically encode the text it is
     * > given.
     *
     * Encodes a string of text in this font.
     *
     * @param text The text to be encoded.
     * @returns The encoded text as a hex string.
     */
    PDFFont.prototype.encodeText = function (text) {
        assertIs(text, 'text', ['string']);
        this.modified = true;
        return this.embedder.encodeText(text);
    };
    /**
     * Measure the width of a string of text drawn in this font at a given size.
     * For example:
     * ```js
     * const width = font.widthOfTextAtSize('Foo Bar Qux Baz', 36)
     * ```
     * @param text The string of text to be measured.
     * @param size The font size to be used for this measurement.
     * @returns The width of the string of text when drawn in this font at the
     *          given size.
     */
    PDFFont.prototype.widthOfTextAtSize = function (text, size) {
        assertIs(text, 'text', ['string']);
        assertIs(size, 'size', ['number']);
        return this.embedder.widthOfTextAtSize(text, size);
    };
    /**
     * Measure the height of this font at a given size. For example:
     * ```js
     * const height = font.heightAtSize(24)
     * ```
     *
     * The `options.descender` value controls whether or not the font's
     * descender is included in the height calculation.
     *
     * @param size The font size to be used for this measurement.
     * @param options The options to be used when computing this measurement.
     * @returns The height of this font at the given size.
     */
    PDFFont.prototype.heightAtSize = function (size, options) {
        var _a;
        assertIs(size, 'size', ['number']);
        assertOrUndefined(options === null || options === void 0 ? void 0 : options.descender, 'options.descender', ['boolean']);
        return this.embedder.heightOfFontAtSize(size, {
            descender: (_a = options === null || options === void 0 ? void 0 : options.descender) !== null && _a !== void 0 ? _a : true,
        });
    };
    /**
     * Compute the font size at which this font is a given height. For example:
     * ```js
     * const fontSize = font.sizeAtHeight(12)
     * ```
     * @param height The height to be used for this calculation.
     * @returns The font size at which this font is the given height.
     */
    PDFFont.prototype.sizeAtHeight = function (height) {
        assertIs(height, 'height', ['number']);
        return this.embedder.sizeOfFontAtHeight(height);
    };
    /**
     * Get the set of unicode code points that can be represented by this font.
     * @returns The set of unicode code points supported by this font.
     */
    PDFFont.prototype.getCharacterSet = function () {
        if (this.embedder instanceof StandardFontEmbedder) {
            return this.embedder.encoding.supportedCodePoints;
        }
        else {
            return this.embedder.font.characterSet;
        }
    };
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all fonts get embedded.
     *
     * Embed this font in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFFont.prototype.embed = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.modified) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        _a.sent();
                        this.modified = false;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.embedFont]] and
     * > [[PDFDocument.embedStandardFont]] methods, which will create instances
     * > of [[PDFFont]] for you.
     *
     * Create an instance of [[PDFFont]] from an existing ref and embedder
     *
     * @param ref The unique reference for this font.
     * @param doc The document to which the font will belong.
     * @param embedder The embedder that will be used to embed the font.
     */
    PDFFont.of = function (ref, doc, embedder) {
        return new PDFFont(ref, doc, embedder);
    };
    return PDFFont;
}());
export default PDFFont;
//# sourceMappingURL=PDFFont.js.map