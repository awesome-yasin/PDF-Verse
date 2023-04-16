import { __awaiter, __generator } from "tslib";
import { PDFName, PDFArray, PDFDict, PDFHexString } from "../core";
/**
 * Represents a file that has been embedded in a [[PDFDocument]].
 */
var PDFEmbeddedFile = /** @class */ (function () {
    function PDFEmbeddedFile(ref, doc, embedder) {
        this.alreadyEmbedded = false;
        this.ref = ref;
        this.doc = doc;
        this.embedder = embedder;
    }
    /**
     * > **NOTE:** You probably don't need to call this method directly. The
     * > [[PDFDocument.save]] and [[PDFDocument.saveAsBase64]] methods will
     * > automatically ensure all embeddable files get embedded.
     *
     * Embed this embeddable file in its document.
     *
     * @returns Resolves when the embedding is complete.
     */
    PDFEmbeddedFile.prototype.embed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ref, Names, EmbeddedFiles, EFNames, AF;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!this.alreadyEmbedded) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.embedder.embedIntoContext(this.doc.context, this.ref)];
                    case 1:
                        ref = _a.sent();
                        if (!this.doc.catalog.has(PDFName.of('Names'))) {
                            this.doc.catalog.set(PDFName.of('Names'), this.doc.context.obj({}));
                        }
                        Names = this.doc.catalog.lookup(PDFName.of('Names'), PDFDict);
                        if (!Names.has(PDFName.of('EmbeddedFiles'))) {
                            Names.set(PDFName.of('EmbeddedFiles'), this.doc.context.obj({}));
                        }
                        EmbeddedFiles = Names.lookup(PDFName.of('EmbeddedFiles'), PDFDict);
                        if (!EmbeddedFiles.has(PDFName.of('Names'))) {
                            EmbeddedFiles.set(PDFName.of('Names'), this.doc.context.obj([]));
                        }
                        EFNames = EmbeddedFiles.lookup(PDFName.of('Names'), PDFArray);
                        EFNames.push(PDFHexString.fromText(this.embedder.fileName));
                        EFNames.push(ref);
                        /**
                         * The AF-Tag is needed to achieve PDF-A3 compliance for embedded files
                         *
                         * The following document outlines the uses cases of the associated files (AF) tag.
                         * See:
                         * https://www.pdfa.org/wp-content/uploads/2018/10/PDF20_AN002-AF.pdf
                         */
                        if (!this.doc.catalog.has(PDFName.of('AF'))) {
                            this.doc.catalog.set(PDFName.of('AF'), this.doc.context.obj([]));
                        }
                        AF = this.doc.catalog.lookup(PDFName.of('AF'), PDFArray);
                        AF.push(ref);
                        this.alreadyEmbedded = true;
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFDocument.attach]] method, which will create
     * instances of [[PDFEmbeddedFile]] for you.
     *
     * Create an instance of [[PDFEmbeddedFile]] from an existing ref and embedder
     *
     * @param ref The unique reference for this file.
     * @param doc The document to which the file will belong.
     * @param embedder The embedder that will be used to embed the file.
     */
    PDFEmbeddedFile.of = function (ref, doc, embedder) {
        return new PDFEmbeddedFile(ref, doc, embedder);
    };
    return PDFEmbeddedFile;
}());
export default PDFEmbeddedFile;
//# sourceMappingURL=PDFEmbeddedFile.js.map