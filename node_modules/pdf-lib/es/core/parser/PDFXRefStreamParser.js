import { ReparseError } from "../errors";
import PDFArray from "../objects/PDFArray";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFRef from "../objects/PDFRef";
import ByteStream from "./ByteStream";
var PDFXRefStreamParser = /** @class */ (function () {
    function PDFXRefStreamParser(rawStream) {
        this.alreadyParsed = false;
        this.dict = rawStream.dict;
        this.bytes = ByteStream.fromPDFRawStream(rawStream);
        this.context = this.dict.context;
        var Size = this.dict.lookup(PDFName.of('Size'), PDFNumber);
        var Index = this.dict.lookup(PDFName.of('Index'));
        if (Index instanceof PDFArray) {
            this.subsections = [];
            for (var idx = 0, len = Index.size(); idx < len; idx += 2) {
                var firstObjectNumber = Index.lookup(idx + 0, PDFNumber).asNumber();
                var length_1 = Index.lookup(idx + 1, PDFNumber).asNumber();
                this.subsections.push({ firstObjectNumber: firstObjectNumber, length: length_1 });
            }
        }
        else {
            this.subsections = [{ firstObjectNumber: 0, length: Size.asNumber() }];
        }
        var W = this.dict.lookup(PDFName.of('W'), PDFArray);
        this.byteWidths = [-1, -1, -1];
        for (var idx = 0, len = W.size(); idx < len; idx++) {
            this.byteWidths[idx] = W.lookup(idx, PDFNumber).asNumber();
        }
    }
    PDFXRefStreamParser.prototype.parseIntoContext = function () {
        if (this.alreadyParsed) {
            throw new ReparseError('PDFXRefStreamParser', 'parseIntoContext');
        }
        this.alreadyParsed = true;
        this.context.trailerInfo = {
            Root: this.dict.get(PDFName.of('Root')),
            Encrypt: this.dict.get(PDFName.of('Encrypt')),
            Info: this.dict.get(PDFName.of('Info')),
            ID: this.dict.get(PDFName.of('ID')),
        };
        var entries = this.parseEntries();
        // for (let idx = 0, len = entries.length; idx < len; idx++) {
        // const entry = entries[idx];
        // if (entry.deleted) this.context.delete(entry.ref);
        // }
        return entries;
    };
    PDFXRefStreamParser.prototype.parseEntries = function () {
        var entries = [];
        var _a = this.byteWidths, typeFieldWidth = _a[0], offsetFieldWidth = _a[1], genFieldWidth = _a[2];
        for (var subsectionIdx = 0, subsectionLen = this.subsections.length; subsectionIdx < subsectionLen; subsectionIdx++) {
            var _b = this.subsections[subsectionIdx], firstObjectNumber = _b.firstObjectNumber, length_2 = _b.length;
            for (var objIdx = 0; objIdx < length_2; objIdx++) {
                var type = 0;
                for (var idx = 0, len = typeFieldWidth; idx < len; idx++) {
                    type = (type << 8) | this.bytes.next();
                }
                var offset = 0;
                for (var idx = 0, len = offsetFieldWidth; idx < len; idx++) {
                    offset = (offset << 8) | this.bytes.next();
                }
                var generationNumber = 0;
                for (var idx = 0, len = genFieldWidth; idx < len; idx++) {
                    generationNumber = (generationNumber << 8) | this.bytes.next();
                }
                // When the `type` field is absent, it defaults to 1
                if (typeFieldWidth === 0)
                    type = 1;
                var objectNumber = firstObjectNumber + objIdx;
                var entry = {
                    ref: PDFRef.of(objectNumber, generationNumber),
                    offset: offset,
                    deleted: type === 0,
                    inObjectStream: type === 2,
                };
                entries.push(entry);
            }
        }
        return entries;
    };
    PDFXRefStreamParser.forStream = function (rawStream) {
        return new PDFXRefStreamParser(rawStream);
    };
    return PDFXRefStreamParser;
}());
export default PDFXRefStreamParser;
//# sourceMappingURL=PDFXRefStreamParser.js.map