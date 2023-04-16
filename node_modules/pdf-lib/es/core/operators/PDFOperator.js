import PDFObject from "../objects/PDFObject";
import CharCodes from "../syntax/CharCodes";
import { copyStringIntoBuffer } from "../../utils";
var PDFOperator = /** @class */ (function () {
    function PDFOperator(name, args) {
        this.name = name;
        this.args = args || [];
    }
    PDFOperator.prototype.clone = function (context) {
        var args = new Array(this.args.length);
        for (var idx = 0, len = args.length; idx < len; idx++) {
            var arg = this.args[idx];
            args[idx] = arg instanceof PDFObject ? arg.clone(context) : arg;
        }
        return PDFOperator.of(this.name, args);
    };
    PDFOperator.prototype.toString = function () {
        var value = '';
        for (var idx = 0, len = this.args.length; idx < len; idx++) {
            value += String(this.args[idx]) + ' ';
        }
        value += this.name;
        return value;
    };
    PDFOperator.prototype.sizeInBytes = function () {
        var size = 0;
        for (var idx = 0, len = this.args.length; idx < len; idx++) {
            var arg = this.args[idx];
            size += (arg instanceof PDFObject ? arg.sizeInBytes() : arg.length) + 1;
        }
        size += this.name.length;
        return size;
    };
    PDFOperator.prototype.copyBytesInto = function (buffer, offset) {
        var initialOffset = offset;
        for (var idx = 0, len = this.args.length; idx < len; idx++) {
            var arg = this.args[idx];
            if (arg instanceof PDFObject) {
                offset += arg.copyBytesInto(buffer, offset);
            }
            else {
                offset += copyStringIntoBuffer(arg, buffer, offset);
            }
            buffer[offset++] = CharCodes.Space;
        }
        offset += copyStringIntoBuffer(this.name, buffer, offset);
        return offset - initialOffset;
    };
    PDFOperator.of = function (name, args) {
        return new PDFOperator(name, args);
    };
    return PDFOperator;
}());
export default PDFOperator;
//# sourceMappingURL=PDFOperator.js.map