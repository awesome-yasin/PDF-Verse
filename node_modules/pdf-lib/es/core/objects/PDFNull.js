import { __extends } from "tslib";
import PDFObject from "./PDFObject";
import CharCodes from "../syntax/CharCodes";
var PDFNull = /** @class */ (function (_super) {
    __extends(PDFNull, _super);
    function PDFNull() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFNull.prototype.asNull = function () {
        return null;
    };
    PDFNull.prototype.clone = function () {
        return this;
    };
    PDFNull.prototype.toString = function () {
        return 'null';
    };
    PDFNull.prototype.sizeInBytes = function () {
        return 4;
    };
    PDFNull.prototype.copyBytesInto = function (buffer, offset) {
        buffer[offset++] = CharCodes.n;
        buffer[offset++] = CharCodes.u;
        buffer[offset++] = CharCodes.l;
        buffer[offset++] = CharCodes.l;
        return 4;
    };
    return PDFNull;
}(PDFObject));
export default new PDFNull();
//# sourceMappingURL=PDFNull.js.map