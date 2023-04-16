import CharCodes from "../syntax/CharCodes";
import { copyStringIntoBuffer } from "../../utils";
var PDFTrailer = /** @class */ (function () {
    function PDFTrailer(lastXRefOffset) {
        this.lastXRefOffset = String(lastXRefOffset);
    }
    PDFTrailer.prototype.toString = function () {
        return "startxref\n" + this.lastXRefOffset + "\n%%EOF";
    };
    PDFTrailer.prototype.sizeInBytes = function () {
        return 16 + this.lastXRefOffset.length;
    };
    PDFTrailer.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes.s;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.a;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.t;
        buffer[offset++] = CharCodes.x;
        buffer[offset++] = CharCodes.r;
        buffer[offset++] = CharCodes.e;
        buffer[offset++] = CharCodes.f;
        buffer[offset++] = CharCodes.Newline;
        offset += copyStringIntoBuffer(this.lastXRefOffset, buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.Percent;
        buffer[offset++] = CharCodes.Percent;
        buffer[offset++] = CharCodes.E;
        buffer[offset++] = CharCodes.O;
        buffer[offset++] = CharCodes.F;
        return offset - initialOffset;
    };
    PDFTrailer.forLastCrossRefSectionOffset = function (offset) {
        return new PDFTrailer(offset);
    };
    return PDFTrailer;
}());
export default PDFTrailer;
//# sourceMappingURL=PDFTrailer.js.map