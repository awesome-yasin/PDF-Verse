import { __extends } from "tslib";
import { PDFObjectParsingError, PDFStreamParsingError, UnbalancedParenthesisError, } from "../errors";
import PDFArray from "../objects/PDFArray";
import PDFBool from "../objects/PDFBool";
import PDFDict from "../objects/PDFDict";
import PDFHexString from "../objects/PDFHexString";
import PDFName from "../objects/PDFName";
import PDFNull from "../objects/PDFNull";
import PDFNumber from "../objects/PDFNumber";
import PDFRawStream from "../objects/PDFRawStream";
import PDFRef from "../objects/PDFRef";
import PDFString from "../objects/PDFString";
import BaseParser from "./BaseParser";
import ByteStream from "./ByteStream";
import PDFCatalog from "../structures/PDFCatalog";
import PDFPageLeaf from "../structures/PDFPageLeaf";
import PDFPageTree from "../structures/PDFPageTree";
import CharCodes from "../syntax/CharCodes";
import { IsDelimiter } from "../syntax/Delimiters";
import { Keywords } from "../syntax/Keywords";
import { IsDigit, IsNumeric } from "../syntax/Numeric";
import { IsWhitespace } from "../syntax/Whitespace";
import { charFromCode } from "../../utils";
// TODO: Throw error if eof is reached before finishing object parse...
var PDFObjectParser = /** @class */ (function (_super) {
    __extends(PDFObjectParser, _super);
    function PDFObjectParser(byteStream, context, capNumbers) {
        if (capNumbers === void 0) { capNumbers = false; }
        var _this = _super.call(this, byteStream, capNumbers) || this;
        _this.context = context;
        return _this;
    }
    // TODO: Is it possible to reduce duplicate parsing for ref lookaheads?
    PDFObjectParser.prototype.parseObject = function () {
        this.skipWhitespaceAndComments();
        if (this.matchKeyword(Keywords.true))
            return PDFBool.True;
        if (this.matchKeyword(Keywords.false))
            return PDFBool.False;
        if (this.matchKeyword(Keywords.null))
            return PDFNull;
        var byte = this.bytes.peek();
        if (byte === CharCodes.LessThan &&
            this.bytes.peekAhead(1) === CharCodes.LessThan) {
            return this.parseDictOrStream();
        }
        if (byte === CharCodes.LessThan)
            return this.parseHexString();
        if (byte === CharCodes.LeftParen)
            return this.parseString();
        if (byte === CharCodes.ForwardSlash)
            return this.parseName();
        if (byte === CharCodes.LeftSquareBracket)
            return this.parseArray();
        if (IsNumeric[byte])
            return this.parseNumberOrRef();
        throw new PDFObjectParsingError(this.bytes.position(), byte);
    };
    PDFObjectParser.prototype.parseNumberOrRef = function () {
        var firstNum = this.parseRawNumber();
        this.skipWhitespaceAndComments();
        var lookaheadStart = this.bytes.offset();
        if (IsDigit[this.bytes.peek()]) {
            var secondNum = this.parseRawNumber();
            this.skipWhitespaceAndComments();
            if (this.bytes.peek() === CharCodes.R) {
                this.bytes.assertNext(CharCodes.R);
                return PDFRef.of(firstNum, secondNum);
            }
        }
        this.bytes.moveTo(lookaheadStart);
        return PDFNumber.of(firstNum);
    };
    // TODO: Maybe update PDFHexString.of() logic to remove whitespace and validate input?
    PDFObjectParser.prototype.parseHexString = function () {
        var value = '';
        this.bytes.assertNext(CharCodes.LessThan);
        while (!this.bytes.done() && this.bytes.peek() !== CharCodes.GreaterThan) {
            value += charFromCode(this.bytes.next());
        }
        this.bytes.assertNext(CharCodes.GreaterThan);
        return PDFHexString.of(value);
    };
    PDFObjectParser.prototype.parseString = function () {
        var nestingLvl = 0;
        var isEscaped = false;
        var value = '';
        while (!this.bytes.done()) {
            var byte = this.bytes.next();
            value += charFromCode(byte);
            // Check for unescaped parenthesis
            if (!isEscaped) {
                if (byte === CharCodes.LeftParen)
                    nestingLvl += 1;
                if (byte === CharCodes.RightParen)
                    nestingLvl -= 1;
            }
            // Track whether current character is being escaped or not
            if (byte === CharCodes.BackSlash) {
                isEscaped = !isEscaped;
            }
            else if (isEscaped) {
                isEscaped = false;
            }
            // Once (if) the unescaped parenthesis balance out, return their contents
            if (nestingLvl === 0) {
                // Remove the outer parens so they aren't part of the contents
                return PDFString.of(value.substring(1, value.length - 1));
            }
        }
        throw new UnbalancedParenthesisError(this.bytes.position());
    };
    // TODO: Compare performance of string concatenation to charFromCode(...bytes)
    // TODO: Maybe preallocate small Uint8Array if can use charFromCode?
    PDFObjectParser.prototype.parseName = function () {
        this.bytes.assertNext(CharCodes.ForwardSlash);
        var name = '';
        while (!this.bytes.done()) {
            var byte = this.bytes.peek();
            if (IsWhitespace[byte] || IsDelimiter[byte])
                break;
            name += charFromCode(byte);
            this.bytes.next();
        }
        return PDFName.of(name);
    };
    PDFObjectParser.prototype.parseArray = function () {
        this.bytes.assertNext(CharCodes.LeftSquareBracket);
        this.skipWhitespaceAndComments();
        var pdfArray = PDFArray.withContext(this.context);
        while (this.bytes.peek() !== CharCodes.RightSquareBracket) {
            var element = this.parseObject();
            pdfArray.push(element);
            this.skipWhitespaceAndComments();
        }
        this.bytes.assertNext(CharCodes.RightSquareBracket);
        return pdfArray;
    };
    PDFObjectParser.prototype.parseDict = function () {
        this.bytes.assertNext(CharCodes.LessThan);
        this.bytes.assertNext(CharCodes.LessThan);
        this.skipWhitespaceAndComments();
        var dict = new Map();
        while (!this.bytes.done() &&
            this.bytes.peek() !== CharCodes.GreaterThan &&
            this.bytes.peekAhead(1) !== CharCodes.GreaterThan) {
            var key = this.parseName();
            var value = this.parseObject();
            dict.set(key, value);
            this.skipWhitespaceAndComments();
        }
        this.skipWhitespaceAndComments();
        this.bytes.assertNext(CharCodes.GreaterThan);
        this.bytes.assertNext(CharCodes.GreaterThan);
        var Type = dict.get(PDFName.of('Type'));
        if (Type === PDFName.of('Catalog')) {
            return PDFCatalog.fromMapWithContext(dict, this.context);
        }
        else if (Type === PDFName.of('Pages')) {
            return PDFPageTree.fromMapWithContext(dict, this.context);
        }
        else if (Type === PDFName.of('Page')) {
            return PDFPageLeaf.fromMapWithContext(dict, this.context);
        }
        else {
            return PDFDict.fromMapWithContext(dict, this.context);
        }
    };
    PDFObjectParser.prototype.parseDictOrStream = function () {
        var startPos = this.bytes.position();
        var dict = this.parseDict();
        this.skipWhitespaceAndComments();
        if (!this.matchKeyword(Keywords.streamEOF1) &&
            !this.matchKeyword(Keywords.streamEOF2) &&
            !this.matchKeyword(Keywords.streamEOF3) &&
            !this.matchKeyword(Keywords.streamEOF4) &&
            !this.matchKeyword(Keywords.stream)) {
            return dict;
        }
        var start = this.bytes.offset();
        var end;
        var Length = dict.get(PDFName.of('Length'));
        if (Length instanceof PDFNumber) {
            end = start + Length.asNumber();
            this.bytes.moveTo(end);
            this.skipWhitespaceAndComments();
            if (!this.matchKeyword(Keywords.endstream)) {
                this.bytes.moveTo(start);
                end = this.findEndOfStreamFallback(startPos);
            }
        }
        else {
            end = this.findEndOfStreamFallback(startPos);
        }
        var contents = this.bytes.slice(start, end);
        return PDFRawStream.of(dict, contents);
    };
    PDFObjectParser.prototype.findEndOfStreamFallback = function (startPos) {
        // Move to end of stream, while handling nested streams
        var nestingLvl = 1;
        var end = this.bytes.offset();
        while (!this.bytes.done()) {
            end = this.bytes.offset();
            if (this.matchKeyword(Keywords.stream)) {
                nestingLvl += 1;
            }
            else if (this.matchKeyword(Keywords.EOF1endstream) ||
                this.matchKeyword(Keywords.EOF2endstream) ||
                this.matchKeyword(Keywords.EOF3endstream) ||
                this.matchKeyword(Keywords.endstream)) {
                nestingLvl -= 1;
            }
            else {
                this.bytes.next();
            }
            if (nestingLvl === 0)
                break;
        }
        if (nestingLvl !== 0)
            throw new PDFStreamParsingError(startPos);
        return end;
    };
    PDFObjectParser.forBytes = function (bytes, context, capNumbers) { return new PDFObjectParser(ByteStream.of(bytes), context, capNumbers); };
    PDFObjectParser.forByteStream = function (byteStream, context, capNumbers) {
        if (capNumbers === void 0) { capNumbers = false; }
        return new PDFObjectParser(byteStream, context, capNumbers);
    };
    return PDFObjectParser;
}(BaseParser));
export default PDFObjectParser;
//# sourceMappingURL=PDFObjectParser.js.map