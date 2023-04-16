import CharCodes from "../syntax/CharCodes";
import { charFromCode, copyStringIntoBuffer } from "../../utils";
var PDFHeader = /** @class */ (function () {
    function PDFHeader(major, minor) {
        this.major = String(major);
        this.minor = String(minor);
    }
    PDFHeader.prototype.toString = function () {
        var bc = charFromCode(129);
        return "%PDF-" + this.major + "." + this.minor + "\n%" + bc + bc + bc + bc;
    };
    PDFHeader.prototype.sizeInBytes = function () {
        return 12 + this.major.length + this.minor.length;
    };
    PDFHeader.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        buffer[offset++] = CharCodes.Percent;
        buffer[offset++] = CharCodes.P;
        buffer[offset++] = CharCodes.D;
        buffer[offset++] = CharCodes.F;
        buffer[offset++] = CharCodes.Dash;
        offset += copyStringIntoBuffer(this.major, buffer, offset);
        buffer[offset++] = CharCodes.Period;
        offset += copyStringIntoBuffer(this.minor, buffer, offset);
        buffer[offset++] = CharCodes.Newline;
        buffer[offset++] = CharCodes.Percent;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        buffer[offset++] = 129;
        return offset - initialOffset;
    };
    PDFHeader.forVersion = function (major, minor) {
        return new PDFHeader(major, minor);
    };
    return PDFHeader;
}());
export default PDFHeader;
//# sourceMappingURL=PDFHeader.js.map