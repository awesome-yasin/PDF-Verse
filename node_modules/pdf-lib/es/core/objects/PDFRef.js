import { __extends } from "tslib";
import { PrivateConstructorError } from "../errors";
import PDFObject from "./PDFObject";
import { copyStringIntoBuffer } from "../../utils";
var ENFORCER = {};
var pool = new Map();
var PDFRef = /** @class */ (function (_super) {
    __extends(PDFRef, _super);
    function PDFRef(enforcer, objectNumber, generationNumber) {
        var _this = this;
        if (enforcer !== ENFORCER)
            throw new PrivateConstructorError('PDFRef');
        _this = _super.call(this) || this;
        _this.objectNumber = objectNumber;
        _this.generationNumber = generationNumber;
        _this.tag = objectNumber + " " + generationNumber + " R";
        return _this;
    }
    PDFRef.prototype.clone = function () {
        return this;
    };
    PDFRef.prototype.toString = function () {
        return this.tag;
    };
    PDFRef.prototype.sizeInBytes = function () {
        return this.tag.length;
    };
    PDFRef.prototype.copyBytesInto = function (buffer, offset) {
        offset += copyStringIntoBuffer(this.tag, buffer, offset);
        return this.tag.length;
    };
    PDFRef.of = function (objectNumber, generationNumber) {
        if (generationNumber === void 0) { generationNumber = 0; }
        var tag = objectNumber + " " + generationNumber + " R";
        var instance = pool.get(tag);
        if (!instance) {
            instance = new PDFRef(ENFORCER, objectNumber, generationNumber);
            pool.set(tag, instance);
        }
        return instance;
    };
    return PDFRef;
}(PDFObject));
export default PDFRef;
//# sourceMappingURL=PDFRef.js.map