import { __awaiter, __generator } from "tslib";
import PDFCrossRefSection from "../document/PDFCrossRefSection";
import PDFHeader from "../document/PDFHeader";
import PDFTrailer from "../document/PDFTrailer";
import PDFTrailerDict from "../document/PDFTrailerDict";
import PDFObjectStream from "../structures/PDFObjectStream";
import CharCodes from "../syntax/CharCodes";
import { copyStringIntoBuffer, waitForTick } from "../../utils";
var PDFWriter = /** @class */ (function () {
    function PDFWriter(context, objectsPerTick) {
        var _this = this;
        this.parsedObjects = 0;
        this.shouldWaitForTick = function (n) {
            _this.parsedObjects += n;
            return _this.parsedObjects % _this.objectsPerTick === 0;
        };
        this.context = context;
        this.objectsPerTick = objectsPerTick;
    }
    PDFWriter.prototype.serializeToBuffer = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, size, header, indirectObjects, xref, trailerDict, trailer, offset, buffer, idx, len, _b, ref, object, objectNumber, generationNumber, n;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.computeBufferSize()];
                    case 1:
                        _a = _c.sent(), size = _a.size, header = _a.header, indirectObjects = _a.indirectObjects, xref = _a.xref, trailerDict = _a.trailerDict, trailer = _a.trailer;
                        offset = 0;
                        buffer = new Uint8Array(size);
                        offset += header.copyBytesInto(buffer, offset);
                        buffer[offset++] = CharCodes.Newline;
                        buffer[offset++] = CharCodes.Newline;
                        idx = 0, len = indirectObjects.length;
                        _c.label = 2;
                    case 2:
                        if (!(idx < len)) return [3 /*break*/, 5];
                        _b = indirectObjects[idx], ref = _b[0], object = _b[1];
                        objectNumber = String(ref.objectNumber);
                        offset += copyStringIntoBuffer(objectNumber, buffer, offset);
                        buffer[offset++] = CharCodes.Space;
                        generationNumber = String(ref.generationNumber);
                        offset += copyStringIntoBuffer(generationNumber, buffer, offset);
                        buffer[offset++] = CharCodes.Space;
                        buffer[offset++] = CharCodes.o;
                        buffer[offset++] = CharCodes.b;
                        buffer[offset++] = CharCodes.j;
                        buffer[offset++] = CharCodes.Newline;
                        offset += object.copyBytesInto(buffer, offset);
                        buffer[offset++] = CharCodes.Newline;
                        buffer[offset++] = CharCodes.e;
                        buffer[offset++] = CharCodes.n;
                        buffer[offset++] = CharCodes.d;
                        buffer[offset++] = CharCodes.o;
                        buffer[offset++] = CharCodes.b;
                        buffer[offset++] = CharCodes.j;
                        buffer[offset++] = CharCodes.Newline;
                        buffer[offset++] = CharCodes.Newline;
                        n = object instanceof PDFObjectStream ? object.getObjectsCount() : 1;
                        if (!this.shouldWaitForTick(n)) return [3 /*break*/, 4];
                        return [4 /*yield*/, waitForTick()];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        idx++;
                        return [3 /*break*/, 2];
                    case 5:
                        if (xref) {
                            offset += xref.copyBytesInto(buffer, offset);
                            buffer[offset++] = CharCodes.Newline;
                        }
                        if (trailerDict) {
                            offset += trailerDict.copyBytesInto(buffer, offset);
                            buffer[offset++] = CharCodes.Newline;
                            buffer[offset++] = CharCodes.Newline;
                        }
                        offset += trailer.copyBytesInto(buffer, offset);
                        return [2 /*return*/, buffer];
                }
            });
        });
    };
    PDFWriter.prototype.computeIndirectObjectSize = function (_a) {
        var ref = _a[0], object = _a[1];
        var refSize = ref.sizeInBytes() + 3; // 'R' -> 'obj\n'
        var objectSize = object.sizeInBytes() + 9; // '\nendobj\n\n'
        return refSize + objectSize;
    };
    PDFWriter.prototype.createTrailerDict = function () {
        return this.context.obj({
            Size: this.context.largestObjectNumber + 1,
            Root: this.context.trailerInfo.Root,
            Encrypt: this.context.trailerInfo.Encrypt,
            Info: this.context.trailerInfo.Info,
            ID: this.context.trailerInfo.ID,
        });
    };
    PDFWriter.prototype.computeBufferSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var header, size, xref, indirectObjects, idx, len, indirectObject, ref, xrefOffset, trailerDict, trailer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        header = PDFHeader.forVersion(1, 7);
                        size = header.sizeInBytes() + 2;
                        xref = PDFCrossRefSection.create();
                        indirectObjects = this.context.enumerateIndirectObjects();
                        idx = 0, len = indirectObjects.length;
                        _a.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 4];
                        indirectObject = indirectObjects[idx];
                        ref = indirectObject[0];
                        xref.addEntry(ref, size);
                        size += this.computeIndirectObjectSize(indirectObject);
                        if (!this.shouldWaitForTick(1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, waitForTick()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4:
                        xrefOffset = size;
                        size += xref.sizeInBytes() + 1; // '\n'
                        trailerDict = PDFTrailerDict.of(this.createTrailerDict());
                        size += trailerDict.sizeInBytes() + 2; // '\n\n'
                        trailer = PDFTrailer.forLastCrossRefSectionOffset(xrefOffset);
                        size += trailer.sizeInBytes();
                        return [2 /*return*/, { size: size, header: header, indirectObjects: indirectObjects, xref: xref, trailerDict: trailerDict, trailer: trailer }];
                }
            });
        });
    };
    PDFWriter.forContext = function (context, objectsPerTick) {
        return new PDFWriter(context, objectsPerTick);
    };
    return PDFWriter;
}());
export default PDFWriter;
//# sourceMappingURL=PDFWriter.js.map