// tslint:disable: max-classes-per-file
import { __extends } from "tslib";
// TODO: Include link to documentation with example
var EncryptedPDFError = /** @class */ (function (_super) {
    __extends(EncryptedPDFError, _super);
    function EncryptedPDFError() {
        var _this = this;
        var msg = 'Input document to `PDFDocument.load` is encrypted. You can use `PDFDocument.load(..., { ignoreEncryption: true })` if you wish to load the document anyways.';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return EncryptedPDFError;
}(Error));
export { EncryptedPDFError };
// TODO: Include link to documentation with example
var FontkitNotRegisteredError = /** @class */ (function (_super) {
    __extends(FontkitNotRegisteredError, _super);
    function FontkitNotRegisteredError() {
        var _this = this;
        var msg = 'Input to `PDFDocument.embedFont` was a custom font, but no `fontkit` instance was found. You must register a `fontkit` instance with `PDFDocument.registerFontkit(...)` before embedding custom fonts.';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return FontkitNotRegisteredError;
}(Error));
export { FontkitNotRegisteredError };
// TODO: Include link to documentation with example
var ForeignPageError = /** @class */ (function (_super) {
    __extends(ForeignPageError, _super);
    function ForeignPageError() {
        var _this = this;
        var msg = 'A `page` passed to `PDFDocument.addPage` or `PDFDocument.insertPage` was from a different (foreign) PDF document. If you want to copy pages from one PDFDocument to another, you must use `PDFDocument.copyPages(...)` to copy the pages before adding or inserting them.';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return ForeignPageError;
}(Error));
export { ForeignPageError };
// TODO: Include link to documentation with example
var RemovePageFromEmptyDocumentError = /** @class */ (function (_super) {
    __extends(RemovePageFromEmptyDocumentError, _super);
    function RemovePageFromEmptyDocumentError() {
        var _this = this;
        var msg = 'PDFDocument has no pages so `PDFDocument.removePage` cannot be called';
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return RemovePageFromEmptyDocumentError;
}(Error));
export { RemovePageFromEmptyDocumentError };
var NoSuchFieldError = /** @class */ (function (_super) {
    __extends(NoSuchFieldError, _super);
    function NoSuchFieldError(name) {
        var _this = this;
        var msg = "PDFDocument has no form field with the name \"" + name + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return NoSuchFieldError;
}(Error));
export { NoSuchFieldError };
var UnexpectedFieldTypeError = /** @class */ (function (_super) {
    __extends(UnexpectedFieldTypeError, _super);
    function UnexpectedFieldTypeError(name, expected, actual) {
        var _a, _b;
        var _this = this;
        var expectedType = expected === null || expected === void 0 ? void 0 : expected.name;
        var actualType = (_b = (_a = actual === null || actual === void 0 ? void 0 : actual.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : actual;
        var msg = "Expected field \"" + name + "\" to be of type " + expectedType + ", " +
            ("but it is actually of type " + actualType);
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return UnexpectedFieldTypeError;
}(Error));
export { UnexpectedFieldTypeError };
var MissingOnValueCheckError = /** @class */ (function (_super) {
    __extends(MissingOnValueCheckError, _super);
    function MissingOnValueCheckError(onValue) {
        var _this = this;
        var msg = "Failed to select check box due to missing onValue: \"" + onValue + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return MissingOnValueCheckError;
}(Error));
export { MissingOnValueCheckError };
var FieldAlreadyExistsError = /** @class */ (function (_super) {
    __extends(FieldAlreadyExistsError, _super);
    function FieldAlreadyExistsError(name) {
        var _this = this;
        var msg = "A field already exists with the specified name: \"" + name + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return FieldAlreadyExistsError;
}(Error));
export { FieldAlreadyExistsError };
var InvalidFieldNamePartError = /** @class */ (function (_super) {
    __extends(InvalidFieldNamePartError, _super);
    function InvalidFieldNamePartError(namePart) {
        var _this = this;
        var msg = "Field name contains invalid component: \"" + namePart + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidFieldNamePartError;
}(Error));
export { InvalidFieldNamePartError };
var FieldExistsAsNonTerminalError = /** @class */ (function (_super) {
    __extends(FieldExistsAsNonTerminalError, _super);
    function FieldExistsAsNonTerminalError(name) {
        var _this = this;
        var msg = "A non-terminal field already exists with the specified name: \"" + name + "\"";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return FieldExistsAsNonTerminalError;
}(Error));
export { FieldExistsAsNonTerminalError };
var RichTextFieldReadError = /** @class */ (function (_super) {
    __extends(RichTextFieldReadError, _super);
    function RichTextFieldReadError(fieldName) {
        var _this = this;
        var msg = "Reading rich text fields is not supported: Attempted to read rich text field: " + fieldName;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return RichTextFieldReadError;
}(Error));
export { RichTextFieldReadError };
var CombedTextLayoutError = /** @class */ (function (_super) {
    __extends(CombedTextLayoutError, _super);
    function CombedTextLayoutError(lineLength, cellCount) {
        var _this = this;
        var msg = "Failed to layout combed text as lineLength=" + lineLength + " is greater than cellCount=" + cellCount;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return CombedTextLayoutError;
}(Error));
export { CombedTextLayoutError };
var ExceededMaxLengthError = /** @class */ (function (_super) {
    __extends(ExceededMaxLengthError, _super);
    function ExceededMaxLengthError(textLength, maxLength, name) {
        var _this = this;
        var msg = "Attempted to set text with length=" + textLength + " for TextField with maxLength=" + maxLength + " and name=" + name;
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return ExceededMaxLengthError;
}(Error));
export { ExceededMaxLengthError };
var InvalidMaxLengthError = /** @class */ (function (_super) {
    __extends(InvalidMaxLengthError, _super);
    function InvalidMaxLengthError(textLength, maxLength, name) {
        var _this = this;
        var msg = "Attempted to set maxLength=" + maxLength + ", which is less than " + textLength + ", the length of this field's current value (name=" + name + ")";
        _this = _super.call(this, msg) || this;
        return _this;
    }
    return InvalidMaxLengthError;
}(Error));
export { InvalidMaxLengthError };
//# sourceMappingURL=errors.js.map