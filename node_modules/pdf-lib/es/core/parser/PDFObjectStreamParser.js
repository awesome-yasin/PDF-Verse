import { __awaiter, __extends, __generator } from "tslib";
import { ReparseError } from "../errors";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFRef from "../objects/PDFRef";
import ByteStream from "./ByteStream";
import PDFObjectParser from "./PDFObjectParser";
import { waitForTick } from "../../utils";
var PDFObjectStreamParser = /** @class */ (function (_super) {
    __extends(PDFObjectStreamParser, _super);
    function PDFObjectStreamParser(rawStream, shouldWaitForTick) {
        var _this = _super.call(this, ByteStream.fromPDFRawStream(rawStream), rawStream.dict.context) || this;
        var dict = rawStream.dict;
        _this.alreadyParsed = false;
        _this.shouldWaitForTick = shouldWaitForTick || (function () { return false; });
        _this.firstOffset = dict.lookup(PDFName.of('First'), PDFNumber).asNumber();
        _this.objectCount = dict.lookup(PDFName.of('N'), PDFNumber).asNumber();
        return _this;
    }
    PDFObjectStreamParser.prototype.parseIntoContext = function () {
        return __awaiter(this, void 0, void 0, function () {
            var offsetsAndObjectNumbers, idx, len, _a, objectNumber, offset, object, ref;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (this.alreadyParsed) {
                            throw new ReparseError('PDFObjectStreamParser', 'parseIntoContext');
                        }
                        this.alreadyParsed = true;
                        offsetsAndObjectNumbers = this.parseOffsetsAndObjectNumbers();
                        idx = 0, len = offsetsAndObjectNumbers.length;
                        _b.label = 1;
                    case 1:
                        if (!(idx < len)) return [3 /*break*/, 4];
                        _a = offsetsAndObjectNumbers[idx], objectNumber = _a.objectNumber, offset = _a.offset;
                        this.bytes.moveTo(this.firstOffset + offset);
                        object = this.parseObject();
                        ref = PDFRef.of(objectNumber, 0);
                        this.context.assign(ref, object);
                        if (!this.shouldWaitForTick()) return [3 /*break*/, 3];
                        return [4 /*yield*/, waitForTick()];
                    case 2:
                        _b.sent();
                        _b.label = 3;
                    case 3:
                        idx++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    PDFObjectStreamParser.prototype.parseOffsetsAndObjectNumbers = function () {
        var offsetsAndObjectNumbers = [];
        for (var idx = 0, len = this.objectCount; idx < len; idx++) {
            this.skipWhitespaceAndComments();
            var objectNumber = this.parseRawInt();
            this.skipWhitespaceAndComments();
            var offset = this.parseRawInt();
            offsetsAndObjectNumbers.push({ objectNumber: objectNumber, offset: offset });
        }
        return offsetsAndObjectNumbers;
    };
    PDFObjectStreamParser.forStream = function (rawStream, shouldWaitForTick) { return new PDFObjectStreamParser(rawStream, shouldWaitForTick); };
    return PDFObjectStreamParser;
}(PDFObjectParser));
export default PDFObjectStreamParser;
//# sourceMappingURL=PDFObjectStreamParser.js.map