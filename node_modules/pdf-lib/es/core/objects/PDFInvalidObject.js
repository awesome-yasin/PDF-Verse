import { __extends } from "tslib";
import PDFObject from "./PDFObject";
var PDFInvalidObject = /** @class */ (function (_super) {
    __extends(PDFInvalidObject, _super);
    function PDFInvalidObject(data) {
        var _this = _super.call(this) || this;
        _this.data = data;
        return _this;
    }
    PDFInvalidObject.prototype.clone = function () {
        return PDFInvalidObject.of(this.data.slice());
    };
    PDFInvalidObject.prototype.toString = function () {
        return "PDFInvalidObject(" + this.data.length + " bytes)";
    };
    PDFInvalidObject.prototype.sizeInBytes = function () {
        return this.data.length;
    };
    PDFInvalidObject.prototype.copyBytesInto = function (buffer, offset) {
        var length = this.data.length;
        for (var idx = 0; idx < length; idx++) {
            buffer[offset++] = this.data[idx];
        }
        return length;
    };
    PDFInvalidObject.of = function (data) { return new PDFInvalidObject(data); };
    return PDFInvalidObject;
}(PDFObject));
export default PDFInvalidObject;
//# sourceMappingURL=PDFInvalidObject.js.map