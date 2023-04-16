import PDFDict from "../objects/PDFDict";
import PDFString from "../objects/PDFString";
import PDFHexString from "../objects/PDFHexString";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFArray from "../objects/PDFArray";
import PDFRef from "../objects/PDFRef";
import { findLastMatch } from "../../utils";
import { MissingDAEntryError, MissingTfOperatorError } from "../errors";
// Examples:
//   `/Helv 12 Tf` -> ['Helv', '12']
//   `/HeBo 8.00 Tf` -> ['HeBo', '8.00']
//   `/HeBo Tf` -> ['HeBo', undefined]
var tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+Tf/;
var PDFAcroField = /** @class */ (function () {
    function PDFAcroField(dict, ref) {
        this.dict = dict;
        this.ref = ref;
    }
    PDFAcroField.prototype.T = function () {
        return this.dict.lookupMaybe(PDFName.of('T'), PDFString, PDFHexString);
    };
    PDFAcroField.prototype.Ff = function () {
        var numberOrRef = this.getInheritableAttribute(PDFName.of('Ff'));
        return this.dict.context.lookupMaybe(numberOrRef, PDFNumber);
    };
    PDFAcroField.prototype.V = function () {
        var valueOrRef = this.getInheritableAttribute(PDFName.of('V'));
        return this.dict.context.lookup(valueOrRef);
    };
    PDFAcroField.prototype.Kids = function () {
        return this.dict.lookupMaybe(PDFName.of('Kids'), PDFArray);
    };
    // Parent(): PDFDict | undefined {
    //   return this.dict.lookupMaybe(PDFName.of('Parent'), PDFDict);
    // }
    PDFAcroField.prototype.DA = function () {
        var da = this.dict.lookup(PDFName.of('DA'));
        if (da instanceof PDFString || da instanceof PDFHexString)
            return da;
        return undefined;
    };
    PDFAcroField.prototype.setKids = function (kids) {
        this.dict.set(PDFName.of('Kids'), this.dict.context.obj(kids));
    };
    PDFAcroField.prototype.getParent = function () {
        // const parent = this.Parent();
        // if (!parent) return undefined;
        // return new PDFAcroField(parent);
        var parentRef = this.dict.get(PDFName.of('Parent'));
        if (parentRef instanceof PDFRef) {
            var parent_1 = this.dict.lookup(PDFName.of('Parent'), PDFDict);
            return new PDFAcroField(parent_1, parentRef);
        }
        return undefined;
    };
    PDFAcroField.prototype.setParent = function (parent) {
        if (!parent)
            this.dict.delete(PDFName.of('Parent'));
        else
            this.dict.set(PDFName.of('Parent'), parent);
    };
    PDFAcroField.prototype.getFullyQualifiedName = function () {
        var parent = this.getParent();
        if (!parent)
            return this.getPartialName();
        return parent.getFullyQualifiedName() + "." + this.getPartialName();
    };
    PDFAcroField.prototype.getPartialName = function () {
        var _a;
        return (_a = this.T()) === null || _a === void 0 ? void 0 : _a.decodeText();
    };
    PDFAcroField.prototype.setPartialName = function (partialName) {
        if (!partialName)
            this.dict.delete(PDFName.of('T'));
        else
            this.dict.set(PDFName.of('T'), PDFHexString.fromText(partialName));
    };
    PDFAcroField.prototype.setDefaultAppearance = function (appearance) {
        this.dict.set(PDFName.of('DA'), PDFString.of(appearance));
    };
    PDFAcroField.prototype.getDefaultAppearance = function () {
        var DA = this.DA();
        if (DA instanceof PDFHexString) {
            return DA.decodeText();
        }
        return DA === null || DA === void 0 ? void 0 : DA.asString();
    };
    PDFAcroField.prototype.setFontSize = function (fontSize) {
        var _a;
        var name = (_a = this.getFullyQualifiedName()) !== null && _a !== void 0 ? _a : '';
        var da = this.getDefaultAppearance();
        if (!da)
            throw new MissingDAEntryError(name);
        var daMatch = findLastMatch(da, tfRegex);
        if (!daMatch.match)
            throw new MissingTfOperatorError(name);
        var daStart = da.slice(0, daMatch.pos - daMatch.match[0].length);
        var daEnd = daMatch.pos <= da.length ? da.slice(daMatch.pos) : '';
        var fontName = daMatch.match[1];
        var modifiedDa = daStart + " /" + fontName + " " + fontSize + " Tf " + daEnd;
        this.setDefaultAppearance(modifiedDa);
    };
    PDFAcroField.prototype.getFlags = function () {
        var _a, _b;
        return (_b = (_a = this.Ff()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 0;
    };
    PDFAcroField.prototype.setFlags = function (flags) {
        this.dict.set(PDFName.of('Ff'), PDFNumber.of(flags));
    };
    PDFAcroField.prototype.hasFlag = function (flag) {
        var flags = this.getFlags();
        return (flags & flag) !== 0;
    };
    PDFAcroField.prototype.setFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags | flag);
    };
    PDFAcroField.prototype.clearFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags & ~flag);
    };
    PDFAcroField.prototype.setFlagTo = function (flag, enable) {
        if (enable)
            this.setFlag(flag);
        else
            this.clearFlag(flag);
    };
    PDFAcroField.prototype.getInheritableAttribute = function (name) {
        var attribute;
        this.ascend(function (node) {
            if (!attribute)
                attribute = node.dict.get(name);
        });
        return attribute;
    };
    PDFAcroField.prototype.ascend = function (visitor) {
        visitor(this);
        var parent = this.getParent();
        if (parent)
            parent.ascend(visitor);
    };
    return PDFAcroField;
}());
export default PDFAcroField;
//# sourceMappingURL=PDFAcroField.js.map