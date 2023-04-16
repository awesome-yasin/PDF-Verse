import { __extends } from "tslib";
import pako from 'pako';
import { MethodNotImplementedError } from "../errors";
import PDFName from "../objects/PDFName";
import PDFStream from "../objects/PDFStream";
import { Cache } from "../../utils";
var PDFFlateStream = /** @class */ (function (_super) {
    __extends(PDFFlateStream, _super);
    function PDFFlateStream(dict, encode) {
        var _this = _super.call(this, dict) || this;
        _this.computeContents = function () {
            var unencodedContents = _this.getUnencodedContents();
            return _this.encode ? pako.deflate(unencodedContents) : unencodedContents;
        };
        _this.encode = encode;
        if (encode)
            dict.set(PDFName.of('Filter'), PDFName.of('FlateDecode'));
        _this.contentsCache = Cache.populatedBy(_this.computeContents);
        return _this;
    }
    PDFFlateStream.prototype.getContents = function () {
        return this.contentsCache.access();
    };
    PDFFlateStream.prototype.getContentsSize = function () {
        return this.contentsCache.access().length;
    };
    PDFFlateStream.prototype.getUnencodedContents = function () {
        throw new MethodNotImplementedError(this.constructor.name, 'getUnencodedContents');
    };
    return PDFFlateStream;
}(PDFStream));
export default PDFFlateStream;
//# sourceMappingURL=PDFFlateStream.js.map