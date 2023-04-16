import { __extends } from "tslib";
import PDFObject from "./PDFObject";
import CharCodes from "../syntax/CharCodes";
import { copyStringIntoBuffer, padStart, utf16Decode, pdfDocEncodingDecode, toCharCode, parseDate, hasUtf16BOM, } from "../../utils";
import { InvalidPDFDateStringError } from "../errors";
var PDFString = /** @class */ (function (_super) {
    __extends(PDFString, _super);
    function PDFString(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    PDFString.prototype.asBytes = function () {
        var bytes = [];
        var octal = '';
        var escaped = false;
        var pushByte = function (byte) {
            if (byte !== undefined)
                bytes.push(byte);
            escaped = false;
        };
        for (var idx = 0, len = this.value.length; idx < len; idx++) {
            var char = this.value[idx];
            var byte = toCharCode(char);
            var nextChar = this.value[idx + 1];
            if (!escaped) {
                if (byte === CharCodes.BackSlash)
                    escaped = true;
                else
                    pushByte(byte);
            }
            else {
                if (byte === CharCodes.Newline)
                    pushByte();
                else if (byte === CharCodes.CarriageReturn)
                    pushByte();
                else if (byte === CharCodes.n)
                    pushByte(CharCodes.Newline);
                else if (byte === CharCodes.r)
                    pushByte(CharCodes.CarriageReturn);
                else if (byte === CharCodes.t)
                    pushByte(CharCodes.Tab);
                else if (byte === CharCodes.b)
                    pushByte(CharCodes.Backspace);
                else if (byte === CharCodes.f)
                    pushByte(CharCodes.FormFeed);
                else if (byte === CharCodes.LeftParen)
                    pushByte(CharCodes.LeftParen);
                else if (byte === CharCodes.RightParen)
                    pushByte(CharCodes.RightParen);
                else if (byte === CharCodes.Backspace)
                    pushByte(CharCodes.BackSlash);
                else if (byte >= CharCodes.Zero && byte <= CharCodes.Seven) {
                    octal += char;
                    if (octal.length === 3 || !(nextChar >= '0' && nextChar <= '7')) {
                        pushByte(parseInt(octal, 8));
                        octal = '';
                    }
                }
                else {
                    pushByte(byte);
                }
            }
        }
        return new Uint8Array(bytes);
    };
    PDFString.prototype.decodeText = function () {
        var bytes = this.asBytes();
        if (hasUtf16BOM(bytes))
            return utf16Decode(bytes);
        return pdfDocEncodingDecode(bytes);
    };
    PDFString.prototype.decodeDate = function () {
        var text = this.decodeText();
        var date = parseDate(text);
        if (!date)
            throw new InvalidPDFDateStringError(text);
        return date;
    };
    PDFString.prototype.asString = function () {
        return this.value;
    };
    PDFString.prototype.clone = function () {
        return PDFString.of(this.value);
    };
    PDFString.prototype.toString = function () {
        return "(" + this.value + ")";
    };
    PDFString.prototype.sizeInBytes = function () {
        return this.value.length + 2;
    };
    PDFString.prototype.copyBytesInto = function (buffer, offset) {
        buffer[offset++] = CharCodes.LeftParen;
        offset += copyStringIntoBuffer(this.value, buffer, offset);
        buffer[offset++] = CharCodes.RightParen;
        return this.value.length + 2;
    };
    // The PDF spec allows newlines and parens to appear directly within a literal
    // string. These character _may_ be escaped. But they do not _have_ to be. So
    // for simplicity, we will not bother escaping them.
    PDFString.of = function (value) { return new PDFString(value); };
    PDFString.fromDate = function (date) {
        var year = padStart(String(date.getUTCFullYear()), 4, '0');
        var month = padStart(String(date.getUTCMonth() + 1), 2, '0');
        var day = padStart(String(date.getUTCDate()), 2, '0');
        var hours = padStart(String(date.getUTCHours()), 2, '0');
        var mins = padStart(String(date.getUTCMinutes()), 2, '0');
        var secs = padStart(String(date.getUTCSeconds()), 2, '0');
        return new PDFString("D:" + year + month + day + hours + mins + secs + "Z");
    };
    return PDFString;
}(PDFObject));
export default PDFString;
//# sourceMappingURL=PDFString.js.map