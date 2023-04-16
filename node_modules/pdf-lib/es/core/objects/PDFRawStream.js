import { __extends } from "tslib";
import PDFStream from "./PDFStream";
import { arrayAsString } from "../../utils";
var PDFRawStream = /** @class */ (function (_super) {
    __extends(PDFRawStream, _super);
    function PDFRawStream(dict, contents) {
        var _this = _super.call(this, dict) || this;
        _this.contents = contents;
        return _this;
    }
    PDFRawStream.prototype.asUint8Array = function () {
        return this.contents.slice();
    };
    PDFRawStream.prototype.clone = function (context) {
        return PDFRawStream.of(this.dict.clone(context), this.contents.slice());
    };
    PDFRawStream.prototype.getContentsString = function () {
        return arrayAsString(this.contents);
    };
    PDFRawStream.prototype.getContents = function () {
        return this.contents;
    };
    PDFRawStream.prototype.getContentsSize = function () {
        return this.contents.length;
    };
    PDFRawStream.of = function (dict, contents) {
        return new PDFRawStream(dict, contents);
    };
    return PDFRawStream;
}(PDFStream));
export default PDFRawStream;
//# sourceMappingURL=PDFRawStream.js.map