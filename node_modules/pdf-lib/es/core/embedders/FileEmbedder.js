import { __awaiter, __generator } from "tslib";
import PDFString from "../objects/PDFString";
import PDFHexString from "../objects/PDFHexString";
/**
 * From the PDF-A3 specification, section **3.1. Requirements - General**.
 * See:
 * * https://www.pdfa.org/wp-content/uploads/2018/10/PDF20_AN002-AF.pdf
 */
export var AFRelationship;
(function (AFRelationship) {
    AFRelationship["Source"] = "Source";
    AFRelationship["Data"] = "Data";
    AFRelationship["Alternative"] = "Alternative";
    AFRelationship["Supplement"] = "Supplement";
    AFRelationship["EncryptedPayload"] = "EncryptedPayload";
    AFRelationship["FormData"] = "EncryptedPayload";
    AFRelationship["Schema"] = "Schema";
    AFRelationship["Unspecified"] = "Unspecified";
})(AFRelationship || (AFRelationship = {}));
var FileEmbedder = /** @class */ (function () {
    function FileEmbedder(fileData, fileName, options) {
        if (options === void 0) { options = {}; }
        this.fileData = fileData;
        this.fileName = fileName;
        this.options = options;
    }
    FileEmbedder.for = function (bytes, fileName, options) {
        if (options === void 0) { options = {}; }
        return new FileEmbedder(bytes, fileName, options);
    };
    FileEmbedder.prototype.embedIntoContext = function (context, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, mimeType, description, creationDate, modificationDate, afRelationship, embeddedFileStream, embeddedFileStreamRef, fileSpecDict;
            return __generator(this, function (_b) {
                _a = this.options, mimeType = _a.mimeType, description = _a.description, creationDate = _a.creationDate, modificationDate = _a.modificationDate, afRelationship = _a.afRelationship;
                embeddedFileStream = context.flateStream(this.fileData, {
                    Type: 'EmbeddedFile',
                    Subtype: mimeType !== null && mimeType !== void 0 ? mimeType : undefined,
                    Params: {
                        Size: this.fileData.length,
                        CreationDate: creationDate
                            ? PDFString.fromDate(creationDate)
                            : undefined,
                        ModDate: modificationDate
                            ? PDFString.fromDate(modificationDate)
                            : undefined,
                    },
                });
                embeddedFileStreamRef = context.register(embeddedFileStream);
                fileSpecDict = context.obj({
                    Type: 'Filespec',
                    F: PDFString.of(this.fileName),
                    UF: PDFHexString.fromText(this.fileName),
                    EF: { F: embeddedFileStreamRef },
                    Desc: description ? PDFHexString.fromText(description) : undefined,
                    AFRelationship: afRelationship !== null && afRelationship !== void 0 ? afRelationship : undefined,
                });
                if (ref) {
                    context.assign(ref, fileSpecDict);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(fileSpecDict)];
                }
                return [2 /*return*/];
            });
        });
    };
    return FileEmbedder;
}());
export default FileEmbedder;
//# sourceMappingURL=FileEmbedder.js.map