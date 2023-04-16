import { __extends } from "tslib";
import { copyStringIntoBuffer, numberToString } from "../../utils/index";
import PDFObject from "./PDFObject";
var PDFNumber = /** @class */ (function (_super) {
    __extends(PDFNumber, _super);
    function PDFNumber(value) {
        var _this = _super.call(this) || this;
        _this.numberValue = value;
        _this.stringValue = numberToString(value);
        return _this;
    }
    PDFNumber.prototype.asNumber = function () {
        return this.numberValue;
    };
    /** @deprecated in favor of [[PDFNumber.asNumber]] */
    PDFNumber.prototype.value = function () {
        return this.numberValue;
    };
    PDFNumber.prototype.clone = function () {
        return PDFNumber.of(this.numberValue);
    };
    PDFNumber.prototype.toString = function () {
        return this.stringValue;
    };
    PDFNumber.prototype.sizeInBytes = function () {
        return this.stringValue.length;
    };
    PDFNumber.prototype.copyBytesInto = function (buffer, offset) {
        offset += copyStringIntoBuffer(this.stringValue, buffer, offset);
        return this.stringValue.length;
    };
    PDFNumber.of = function (value) { return new PDFNumber(value); };
    return PDFNumber;
}(PDFObject));
export default PDFNumber;
//# sourceMappingURL=PDFNumber.js.map