import { __extends } from "tslib";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFFlateStream from "./PDFFlateStream";
import CharCodes from "../syntax/CharCodes";
import { copyStringIntoBuffer, last } from "../../utils";
var PDFObjectStream = /** @class */ (function (_super) {
    __extends(PDFObjectStream, _super);
    function PDFObjectStream(context, objects, encode) {
        if (encode === void 0) { encode = true; }
        var _this = _super.call(this, context.obj({}), encode) || this;
        _this.objects = objects;
        _this.offsets = _this.computeObjectOffsets();
        _this.offsetsString = _this.computeOffsetsString();
        _this.dict.set(PDFName.of('Type'), PDFName.of('ObjStm'));
        _this.dict.set(PDFName.of('N'), PDFNumber.of(_this.objects.length));
        _this.dict.set(PDFName.of('First'), PDFNumber.of(_this.offsetsString.length));
        return _this;
    }
    PDFObjectStream.prototype.getObjectsCount = function () {
        return this.objects.length;
    };
    PDFObjectStream.prototype.clone = function (context) {
        return PDFObjectStream.withContextAndObjects(context || this.dict.context, this.objects.slice(), this.encode);
    };
    PDFObjectStream.prototype.getContentsString = function () {
        var value = this.offsetsString;
        for (var idx = 0, len = this.objects.length; idx < len; idx++) {
            var _a = this.objects[idx], object = _a[1];
            value += object + "\n";
        }
        return value;
    };
    PDFObjectStream.prototype.getUnencodedContents = function () {
        var buffer = new Uint8Array(this.getUnencodedContentsSize());
        var offset = copyStringIntoBuffer(this.offsetsString, buffer, 0);
        for (var idx = 0, len = this.objects.length; idx < len; idx++) {
            var _a = this.objects[idx], object = _a[1];
            offset += object.copyBytesInto(buffer, offset);
            buffer[offset++] = CharCodes.Newline;
        }
        return buffer;
    };
    PDFObjectStream.prototype.getUnencodedContentsSize = function () {
        return (this.offsetsString.length +
            last(this.offsets)[1] +
            last(this.objects)[1].sizeInBytes() +
            1);
    };
    PDFObjectStream.prototype.computeOffsetsString = function () {
        var offsetsString = '';
        for (var idx = 0, len = this.offsets.length; idx < len; idx++) {
            var _a = this.offsets[idx], objectNumber = _a[0], offset = _a[1];
            offsetsString += objectNumber + " " + offset + " ";
        }
        return offsetsString;
    };
    PDFObjectStream.prototype.computeObjectOffsets = function () {
        var offset = 0;
        var offsets = new Array(this.objects.length);
        for (var idx = 0, len = this.objects.length; idx < len; idx++) {
            var _a = this.objects[idx], ref = _a[0], object = _a[1];
            offsets[idx] = [ref.objectNumber, offset];
            offset += object.sizeInBytes() + 1; // '\n'
        }
        return offsets;
    };
    PDFObjectStream.withContextAndObjects = function (context, objects, encode) {
        if (encode === void 0) { encode = true; }
        return new PDFObjectStream(context, objects, encode);
    };
    return PDFObjectStream;
}(PDFFlateStream));
export default PDFObjectStream;
//# sourceMappingURL=PDFObjectStream.js.map