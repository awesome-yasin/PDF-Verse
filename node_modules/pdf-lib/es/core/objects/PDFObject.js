import { MethodNotImplementedError } from "../errors";
var PDFObject = /** @class */ (function () {
    function PDFObject() {
    }
    PDFObject.prototype.clone = function (_context) {
        throw new MethodNotImplementedError(this.constructor.name, 'clone');
    };
    PDFObject.prototype.toString = function () {
        throw new MethodNotImplementedError(this.constructor.name, 'toString');
    };
    PDFObject.prototype.sizeInBytes = function () {
        throw new MethodNotImplementedError(this.constructor.name, 'sizeInBytes');
    };
    PDFObject.prototype.copyBytesInto = function (_buffer, _offset) {
        throw new MethodNotImplementedError(this.constructor.name, 'copyBytesInto');
    };
    return PDFObject;
}());
export default PDFObject;
//# sourceMappingURL=PDFObject.js.map