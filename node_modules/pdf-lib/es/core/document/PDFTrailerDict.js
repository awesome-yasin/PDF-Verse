import CharCodes from "../syntax/CharCodes";
var PDFTrailerDict = /** @class */ (function () {
    function PDFTrailerDict(dict) {
        this.dict = dict;
    }
    PDFTrailerDict.prototype.toString = function () {
        return "trailer\n" + this.dict.toString();
    };
    PDFTrailerDict.prototype.sizeInBytes = function () {
        return 8 + this.dict.sizeInBytes();
    };
    PDFTrailerDict.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.i;
        buffer[offset++] = CharCodes.l;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.Newline;
        offset += this.dict.copyBytesInto(buffer, offset);
        return offset - initialOffset;
    };
    PDFTrailerDict.of = function (dict) { return new PDFTrailerDict(dict); };
    return PDFTrailerDict;
}());
export default PDFTrailerDict;
//# sourceMappingURL=PDFTrailerDict.js.map