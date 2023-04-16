import { UnexpectedObjectTypeError, UnsupportedEncodingError, } from "../errors";
import PDFArray from "../objects/PDFArray";
import PDFDict from "../objects/PDFDict";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import Ascii85Stream from "./Ascii85Stream";
import AsciiHexStream from "./AsciiHexStream";
import FlateStream from "./FlateStream";
import LZWStream from "./LZWStream";
import RunLengthStream from "./RunLengthStream";
import Stream from "./Stream";
var decodeStream = function (stream, encoding, params) {
    if (encoding === PDFName.of('FlateDecode')) {
        return new FlateStream(stream);
    }
    if (encoding === PDFName.of('LZWDecode')) {
        var earlyChange = 1;
        if (params instanceof PDFDict) {
            var EarlyChange = params.lookup(PDFName.of('EarlyChange'));
            if (EarlyChange instanceof PDFNumber) {
                earlyChange = EarlyChange.asNumber();
            }
        }
        return new LZWStream(stream, undefined, earlyChange);
    }
    if (encoding === PDFName.of('ASCII85Decode')) {
        return new Ascii85Stream(stream);
    }
    if (encoding === PDFName.of('ASCIIHexDecode')) {
        return new AsciiHexStream(stream);
    }
    if (encoding === PDFName.of('RunLengthDecode')) {
        return new RunLengthStream(stream);
    }
    throw new UnsupportedEncodingError(encoding.asString());
};
export var decodePDFRawStream = function (_a) {
    var dict = _a.dict, contents = _a.contents;
    var stream = new Stream(contents);
    var Filter = dict.lookup(PDFName.of('Filter'));
    var DecodeParms = dict.lookup(PDFName.of('DecodeParms'));
    if (Filter instanceof PDFName) {
        stream = decodeStream(stream, Filter, DecodeParms);
    }
    else if (Filter instanceof PDFArray) {
        for (var idx = 0, len = Filter.size(); idx < len; idx++) {
            stream = decodeStream(stream, Filter.lookup(idx, PDFName), DecodeParms && DecodeParms.lookupMaybe(idx, PDFDict));
        }
    }
    else if (!!Filter) {
        throw new UnexpectedObjectTypeError([PDFName, PDFArray], Filter);
    }
    return stream;
};
//# sourceMappingURL=decode.js.map