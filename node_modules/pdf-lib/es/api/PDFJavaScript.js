import { __awaiter, __generator } from "tslib";
import { PDFName, PDFArray, PDFDict, PDFHexString } from "../core";
/**
 * Represents JavaScript that has been embedded in a [[PDFDocument]].
 */
var PDFJavaScript = /** @class */ (function () {
    function PDFJavaScript(ref, doc, embedder) {
        this.alreadyEmbedded = false;
        this.ref = ref;
        this.doc = doc;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all JavaScripts get embedded.
     *
     * Embed this JavaScript in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFJavaScript.prototype.embed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, catalog, context, ref, Names, Javascript, JSNames;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.alreadyEmbedded) return [3 /*break*/, 2];
                        _a = this.doc, catalog = _a.catalog, context = _a.context;
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        ref = _b.sent();
                        if (!catalog.has(PDFName.of('Names'))) {
                            catalog.set(PDFName.of('Names'), context.obj({}));
                        }
                        Names = catalog.lookup(PDFName.of('Names'), PDFDict);
                        if (!Names.has(PDFName.of('JavaScript'))) {
                            Names.set(PDFName.of('JavaScript'), context.obj({}));
                        }
                        Javascript = Names.lookup(PDFName.of('JavaScript'), PDFDict);
                        if (!Javascript.has(PDFName.of('Names'))) {
                            Javascript.set(PDFName.of('Names'), context.obj([]));
                        }
                        JSNames = Javascript.lookup(PDFName.of('Names'), PDFArray);
                        JSNames.push(PDFHexString.fromText(this.embedder.scriptName));
                        JSNames.push(ref);
                        this.alreadyEmbedded = true;
                        _b.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.addJavaScript]] method, which will
     * create instances of [[PDFJavaScript]] for you.
     *
     * Create an instance of [[PDFJavaScript]] from an existing ref and script
     *
     * @param ref The unique reference for this script.
     * @param doc The document to which the script will belong.
     * @param embedder The embedder that will be used to embed the script.
     */
    PDFJavaScript.of = function (ref, doc, embedder) {
        return new PDFJavaScript(ref, doc, embedder);
    };
    return PDFJavaScript;
}());
export default PDFJavaScript;
//# sourceMappingURL=PDFJavaScript.js.map