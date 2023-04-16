import { __extends } from "tslib";
import { MethodNotImplementedError } from "../errors";
import PDFName from "./PDFName";
import PDFNumber from "./PDFNumber";
import PDFObject from "./PDFObject";
import CharCodes from "../syntax/CharCodes";
var PDFStream = /** @class */ (function (_super) {
    __extends(PDFStream, _super);
    function PDFStream(dict) {
        var _this = _super.call(this) || this;
        _this.dict = dict;
        return _this;
    }
    PDFStream.prototype.clone = function (_context) {
        throw new MethodNotImplementedError(this.constructor.name, 'clone');
    };
    PDFStream.prototype.getContentsString = function () {
        throw new MethodNotImplementedError(this.constructor.name, 'getContentsString');
    };
    PDFStream.prototype.getContents = function () {
        throw new MethodNotImplementedError(this.constructor.name, 'getContents');
    };
    PDFStream.prototype.getContentsSize = function () {
        throw new MethodNotImplementedError(this.constructor.name, 'getContentsSize');
    };
    PDFStream.prototype.updateDict = function () {
        var contentsSize = this.getContentsSize();
        this.dict.set(PDFName.Length, PDFNumber.of(contentsSize));
    };
    PDFStream.prototype.sizeInBytes = function () {
        this.updateDict();
        return this.dict.sizeInBytes() + this.getContentsSize() + 18;
    };
    PDFStream.prototype.toString = function () {
        this.updateDict();
        var streamString = this.dict.toString();
        streamString += '\nstream\n';
        streamString += this.getContentsString();
        streamString += '\nendstream';
        return streamString;
    };
    PDFStream.prototype.copyBytesInto = function (buffer, offset) {
        this.updateDict();
        var initialOffset = offset;
        offset += this.dict.copyBytesInto(buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.s;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.m;
        buffer[offset++] = CharCodes.Newline;
        var contents = this.getContents();
        for (var idx = 0, len = contents.length; idx < len; idx++) {
            buffer[offset++] = contents[idx];
        }
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.n;
        buffer[offset++] = CharCodes.d;
        buffer[offset++] = CharCodes.s;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.m;
        return offset - initialOffset;
    };
    return PDFStream;
}(PDFObject));
export default PDFStream;
//# sourceMappingURL=PDFStream.js.map