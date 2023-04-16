import { NumberParsingError } from "../errors";
import CharCodes from "../syntax/CharCodes";
import { IsDigit, IsNumeric } from "../syntax/Numeric";
import { IsWhitespace } from "../syntax/Whitespace";
import { charFromCode } from "../../utils";
var Newline = CharCodes.Newline, CarriageReturn = CharCodes.CarriageReturn;
// TODO: Throw error if eof is reached before finishing object parse...
var BaseParser = /** @class */ (function () {
    function BaseParser(bytes, capNumbers) {
        if (capNumbers === void 0) { capNumbers = false; }
        this.bytes = bytes;
        this.capNumbers = capNumbers;
    }
    BaseParser.prototype.parseRawInt = function () {
        var value = '';
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (!IsDigit[byte])
                break;
            value += charFromCode(this.bytes.next());
        }
        var numberValue = Number(value);
        if (!value || !isFinite(numberValue)) {
            throw new NumberParsingError(this.bytes.position(), value);
        }
        return numberValue;
    };
    // TODO: Maybe handle exponential format?
    // TODO: Compare performance of string concatenation to charFromCode(...bytes)
    BaseParser.prototype.parseRawNumber = function () {
        var value = '';
        // Parse integer-part, the leading (+ | - | . | 0-9)
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (!IsNumeric[byte])
                break;
            value += charFromCode(this.bytes.next());
            if (byte === CharCodes.Period)
                break;
        }
        // Parse decimal-part, the trailing (0-9)
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (!IsDigit[byte])
                break;
            value += charFromCode(this.bytes.next());
        }
        var numberValue = Number(value);
        if (!value || !isFinite(numberValue)) {
            throw new NumberParsingError(this.bytes.position(), value);
        }
        if (numberValue > Number.MAX_SAFE_INTEGER) {
            if (this.capNumbers) {
                var msg = "Parsed number that is too large for some PDF readers: " + value + ", using Number.MAX_SAFE_INTEGER instead.";
                console.warn(msg);
                return Number.MAX_SAFE_INTEGER;
            }
            else {
                var msg = "Parsed number that is too large for some PDF readers: " + value + ", not capping.";
                console.warn(msg);
            }
        }
        return numberValue;
    };
    BaseParser.prototype.skipWhitespace = function () {
        while (!this.bytes.done() && IsWhitespace[this.bytes.peek()]) {
            this.bytes.next();
        }
    };
    BaseParser.prototype.skipLine = function () {
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (byte === Newline || byte === CarriageReturn)
                return;
            this.bytes.next();
        }
    };
    BaseParser.prototype.skipComment = function () {
        if (this.bytes.peek() !== CharCodes.Percent)
            return false;
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (byte === Newline || byte === CarriageReturn)
                return true;
            this.bytes.next();
        }
        return true;
    };
    BaseParser.prototype.skipWhitespaceAndComments = function () {
        this.skipWhitespace();
        while (this.skipComment())
            this.skipWhitespace();
    };
    BaseParser.prototype.matchKeyword = function (keyword) {
        var initialOffset = this.bytes.offset();
        for (var idx = 0, len = keyword.length; idx < len; idx++) {
            if (this.bytes.done() || this.bytes.next() !== keyword[idx]) {
                this.bytes.moveTo(initialOffset);
                return false;
            }
        }
        return true;
    };
    return BaseParser;
}());
export default BaseParser;
//# sourceMappingURL=BaseParser.js.map