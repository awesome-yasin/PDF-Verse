import { __extends } from "tslib";
import { PrivateConstructorError } from "../errors";
import PDFObject from "./PDFObject";
import CharCodes from "../syntax/CharCodes";
var ENFORCER = {};
var PDFBool = /** @class */ (function (_super) {
    __extends(PDFBool, _super);
    function PDFBool(enforcer, value) {
        var _this = this;
        if (enforcer !== ENFORCER)
            throw new PrivateConstructorError('PDFBool');
        _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    PDFBool.prototype.asBoolean = function () {
        return this.value;
    };
    PDFBool.prototype.clone = function () {
        return this;
    };
    PDFBool.prototype.toString = function () {
        return String(this.value);
    };
    PDFBool.prototype.sizeInBytes = function () {
        return this.value ? 4 : 5;
    };
    PDFBool.prototype.copyBytesInto = function (buffer, offset) {
        if (this.value) {
            buffer[offset++] = CharCodes.t;
            buffer[offset++] = CharCodes.r;
            buffer[offset++] = CharCodes.u;
            buffer[offset++] = CharCodes.e;
            return 4;
        }
        else {
            buffer[offset++] = CharCodes.f;
            buffer[offset++] = CharCodes.a;
            buffer[offset++] = CharCodes.l;
            buffer[offset++] = CharCodes.s;
            buffer[offset++] = CharCodes.e;
            return 5;
        }
    };
    PDFBool.True = new PDFBool(ENFORCER, true);
    PDFBool.False = new PDFBool(ENFORCER, false);
    return PDFBool;
}(PDFObject));
export default PDFBool;
//# sourceMappingURL=PDFBool.js.map