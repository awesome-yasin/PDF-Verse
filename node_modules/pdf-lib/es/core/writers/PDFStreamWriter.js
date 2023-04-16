import { __awaiter, __extends, __generator } from "tslib";
import PDFHeader from "../document/PDFHeader";
import PDFTrailer from "../document/PDFTrailer";
import PDFInvalidObject from "../objects/PDFInvalidObject";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFRef from "../objects/PDFRef";
import PDFStream from "../objects/PDFStream";
import PDFCrossRefStream from "../structures/PDFCrossRefStream";
import PDFObjectStream from "../structures/PDFObjectStream";
import PDFWriter from "./PDFWriter";
import { last, waitForTick } from "../../utils";
var PDFStreamWriter = /** @class */ (function (_super) {
    __extends(PDFStreamWriter, _super);
    function PDFStreamWriter(context, objectsPerTick, encodeStreams, objectsPerStream) {
        var _this = _super.call(this, context, objectsPerTick) || this;
        _this.encodeStreams = encodeStreams;
        _this.objectsPerStream = objectsPerStream;
        return _this;
    }
    PDFStreamWriter.prototype.computeBufferSize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var objectNumber, header, size, xrefStream, uncompressedObjects, compressedObjects, objectStreamRefs, indirectObjects, idx, len, indirectObject, ref, object, shouldNotCompress, chunk, objectStreamRef, idx, len, chunk, ref, objectStream, xrefStreamRef, xrefOffset, trailer;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        objectNumber = this.context.largestObjectNumber + 1;
                        header = PDFHeader.forVersion(1, 7);
                        size = header.sizeInBytes() + 2;
                        xrefStream = PDFCrossRefStream.create(this.createTrailerDict(), this.encodeStreams);
                        uncompressedObjects = [];
                        compressedObjects = [];
                        objectStreamRefs = [];
                        indirectObjects = this.context.enumerateIndirectObjects();
                        idx = 0, len = indirectObjects.length;
                        _a.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 6];
                        indirectObject = indirectObjects[idx];
                        ref = indirectObject[0], object = indirectObject[1];
                        shouldNotCompress = ref === this.context.trailerInfo.Encrypt ||
                            object instanceof PDFStream ||
                            object instanceof PDFInvalidObject ||
                            ref.generationNumber !== 0;
                        if (!shouldNotCompress) return [3 /*break*/, 4];
                        uncompressedObjects.push(indirectObject);
                        xrefStream.addUncompressedEntry(ref, size);
                        size += this.computeIndirectObjectSize(indirectObject);
                        if (!this.shouldWaitForTick(1)) return [3 /*break*/, 3];
                        return [4 /*yield*/, waitForTick()];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3: return [3 /*break*/, 5];
                    case 4:
                        chunk = last(compressedObjects);
                        objectStreamRef = last(objectStreamRefs);
                        if (!chunk || chunk.length % this.objectsPerStream === 0) {
                            chunk = [];
                            compressedObjects.push(chunk);
                            objectStreamRef = PDFRef.of(objectNumber++);
                            objectStreamRefs.push(objectStreamRef);
                        }
                        xrefStream.addCompressedEntry(ref, objectStreamRef, chunk.length);
                        chunk.push(indirectObject);
                        _a.label = 5;
                    case 5:
                        idx++;
                        return [3 /*break*/, 1];
                    case 6:
                        idx = 0, len = compressedObjects.length;
                        _a.label = 7;
                    case 7:
                        if (!(idx < len)) return [3 /*break*/, 10];
                        chunk = compressedObjects[idx];
                        ref = objectStreamRefs[idx];
                        objectStream = PDFObjectStream.withContextAndObjects(this.context, chunk, this.encodeStreams);
                        xrefStream.addUncompressedEntry(ref, size);
                        size += this.computeIndirectObjectSize([ref, objectStream]);
                        uncompressedObjects.push([ref, objectStream]);
                        if (!this.shouldWaitForTick(chunk.length)) return [3 /*break*/, 9];
                        return [4 /*yield*/, waitForTick()];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        idx++;
                        return [3 /*break*/, 7];
                    case 10:
                        xrefStreamRef = PDFRef.of(objectNumber++);
                        xrefStream.dict.set(PDFName.of('Size'), PDFNumber.of(objectNumber));
                        xrefStream.addUncompressedEntry(xrefStreamRef, size);
                        xrefOffset = size;
                        size += this.computeIndirectObjectSize([xrefStreamRef, xrefStream]);
                        uncompressedObjects.push([xrefStreamRef, xrefStream]);
                        trailer = PDFTrailer.forLastCrossRefSectionOffset(xrefOffset);
                        size += trailer.sizeInBytes();
                        return [2 /*return*/, { size: size, header: header, indirectObjects: uncompressedObjects, trailer: trailer }];
                }
            });
        });
    };
    PDFStreamWriter.forContext = function (context, objectsPerTick, encodeStreams, objectsPerStream) {
        if (encodeStreams === void 0) { encodeStreams = true; }
        if (objectsPerStream === void 0) { objectsPerStream = 50; }
        return new PDFStreamWriter(context, objectsPerTick, encodeStreams, objectsPerStream);
    };
    return PDFStreamWriter;
}(PDFWriter));
export default PDFStreamWriter;
//# sourceMappingURL=PDFStreamWriter.js.map