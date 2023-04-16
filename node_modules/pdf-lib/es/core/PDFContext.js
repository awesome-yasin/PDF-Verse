import { __assign } from "tslib";
import pako from 'pako';
import PDFHeader from "./document/PDFHeader";
import { UnexpectedObjectTypeError } from "./errors";
import PDFArray from "./objects/PDFArray";
import PDFBool from "./objects/PDFBool";
import PDFDict from "./objects/PDFDict";
import PDFName from "./objects/PDFName";
import PDFNull from "./objects/PDFNull";
import PDFNumber from "./objects/PDFNumber";
import PDFObject from "./objects/PDFObject";
import PDFRawStream from "./objects/PDFRawStream";
import PDFRef from "./objects/PDFRef";
import PDFOperator from "./operators/PDFOperator";
import Ops from "./operators/PDFOperatorNames";
import PDFContentStream from "./structures/PDFContentStream";
import { typedArrayFor } from "../utils";
import { SimpleRNG } from "../utils/rng";
var byAscendingObjectNumber = function (_a, _b) {
    var a = _a[0];
    var b = _b[0];
    return a.objectNumber - b.objectNumber;
};
var PDFContext = /** @class */ (function () {
    function PDFContext() {
        this.largestObjectNumber = 0;
        this.header = PDFHeader.forVersion(1, 7);
        this.trailerInfo = {};
        this.indirectObjects = new Map();
        this.rng = SimpleRNG.withSeed(1);
    }
    PDFContext.prototype.assign = function (ref, object) {
        this.indirectObjects.set(ref, object);
        if (ref.objectNumber > this.largestObjectNumber) {
            this.largestObjectNumber = ref.objectNumber;
        }
    };
    PDFContext.prototype.nextRef = function () {
        this.largestObjectNumber += 1;
        return PDFRef.of(this.largestObjectNumber);
    };
    PDFContext.prototype.register = function (object) {
        var ref = this.nextRef();
        this.assign(ref, object);
        return ref;
    };
    PDFContext.prototype.delete = function (ref) {
        return this.indirectObjects.delete(ref);
    };
    PDFContext.prototype.lookupMaybe = function (ref) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        // TODO: `preservePDFNull` is for backwards compatibility. Should be
        // removed in next breaking API change.
        var preservePDFNull = types.includes(PDFNull);
        var result = ref instanceof PDFRef ? this.indirectObjects.get(ref) : ref;
        if (!result || (result === PDFNull && !preservePDFNull))
            return undefined;
        for (var idx = 0, len = types.length; idx < len; idx++) {
            var type = types[idx];
            if (type === PDFNull) {
                if (result === PDFNull)
                    return result;
            }
            else {
                if (result instanceof type)
                    return result;
            }
        }
        throw new UnexpectedObjectTypeError(types, result);
    };
    PDFContext.prototype.lookup = function (ref) {
        var types = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            types[_i - 1] = arguments[_i];
        }
        var result = ref instanceof PDFRef ? this.indirectObjects.get(ref) : ref;
        if (types.length === 0)
            return result;
        for (var idx = 0, len = types.length; idx < len; idx++) {
            var type = types[idx];
            if (type === PDFNull) {
                if (result === PDFNull)
                    return result;
            }
            else {
                if (result instanceof type)
                    return result;
            }
        }
        throw new UnexpectedObjectTypeError(types, result);
    };
    PDFContext.prototype.getObjectRef = function (pdfObject) {
        var entries = Array.from(this.indirectObjects.entries());
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], ref = _a[0], object = _a[1];
            if (object === pdfObject) {
                return ref;
            }
        }
        return undefined;
    };
    PDFContext.prototype.enumerateIndirectObjects = function () {
        return Array.from(this.indirectObjects.entries()).sort(byAscendingObjectNumber);
    };
    PDFContext.prototype.obj = function (literal) {
        if (literal instanceof PDFObject) {
            return literal;
        }
        else if (literal === null || literal === undefined) {
            return PDFNull;
        }
        else if (typeof literal === 'string') {
            return PDFName.of(literal);
        }
        else if (typeof literal === 'number') {
            return PDFNumber.of(literal);
        }
        else if (typeof literal === 'boolean') {
            return literal ? PDFBool.True : PDFBool.False;
        }
        else if (Array.isArray(literal)) {
            var array = PDFArray.withContext(this);
            for (var idx = 0, len = literal.length; idx < len; idx++) {
                array.push(this.obj(literal[idx]));
            }
            return array;
        }
        else {
            var dict = PDFDict.withContext(this);
            var keys = Object.keys(literal);
            for (var idx = 0, len = keys.length; idx < len; idx++) {
                var key = keys[idx];
                var value = literal[key];
                if (value !== undefined)
                    dict.set(PDFName.of(key), this.obj(value));
            }
            return dict;
        }
    };
    PDFContext.prototype.stream = function (contents, dict) {
        if (dict === void 0) { dict = {}; }
        return PDFRawStream.of(this.obj(dict), typedArrayFor(contents));
    };
    PDFContext.prototype.flateStream = function (contents, dict) {
        if (dict === void 0) { dict = {}; }
        return this.stream(pako.deflate(typedArrayFor(contents)), __assign(__assign({}, dict), { Filter: 'FlateDecode' }));
    };
    PDFContext.prototype.contentStream = function (operators, dict) {
        if (dict === void 0) { dict = {}; }
        return PDFContentStream.of(this.obj(dict), operators);
    };
    PDFContext.prototype.formXObject = function (operators, dict) {
        if (dict === void 0) { dict = {}; }
        return this.contentStream(operators, __assign(__assign({ BBox: this.obj([0, 0, 0, 0]), Matrix: this.obj([1, 0, 0, 1, 0, 0]) }, dict), { Type: 'XObject', Subtype: 'Form' }));
    };
    /*
     * Reference to PDFContentStream that contains a single PDFOperator: `q`.
     * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
     * added to a modified PDF, they start in the default, unchanged graphics
     * state.
     */
    PDFContext.prototype.getPushGraphicsStateContentStream = function () {
        if (this.pushGraphicsStateContentStreamRef) {
            return this.pushGraphicsStateContentStreamRef;
        }
        var dict = this.obj({});
        var op = PDFOperator.of(Ops.PushGraphicsState);
        var stream = PDFContentStream.of(dict, [op]);
        this.pushGraphicsStateContentStreamRef = this.register(stream);
        return this.pushGraphicsStateContentStreamRef;
    };
    /*
     * Reference to PDFContentStream that contains a single PDFOperator: `Q`.
     * Used by [[PDFPageLeaf]] instances to ensure that when content streams are
     * added to a modified PDF, they start in the default, unchanged graphics
     * state.
     */
    PDFContext.prototype.getPopGraphicsStateContentStream = function () {
        if (this.popGraphicsStateContentStreamRef) {
            return this.popGraphicsStateContentStreamRef;
        }
        var dict = this.obj({});
        var op = PDFOperator.of(Ops.PopGraphicsState);
        var stream = PDFContentStream.of(dict, [op]);
        this.popGraphicsStateContentStreamRef = this.register(stream);
        return this.popGraphicsStateContentStreamRef;
    };
    PDFContext.prototype.addRandomSuffix = function (prefix, suffixLength) {
        if (suffixLength === void 0) { suffixLength = 4; }
        return prefix + "-" + Math.floor(this.rng.nextInt() * Math.pow(10, suffixLength));
    };
    PDFContext.create = function () { return new PDFContext(); };
    return PDFContext;
}());
export default PDFContext;
//# sourceMappingURL=PDFContext.js.map