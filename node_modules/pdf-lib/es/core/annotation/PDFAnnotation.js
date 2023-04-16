import PDFDict from "../objects/PDFDict";
import PDFName from "../objects/PDFName";
import PDFStream from "../objects/PDFStream";
import PDFArray from "../objects/PDFArray";
import PDFRef from "../objects/PDFRef";
import PDFNumber from "../objects/PDFNumber";
var PDFAnnotation = /** @class */ (function () {
    function PDFAnnotation(dict) {
        this.dict = dict;
    }
    // This is technically required by the PDF spec
    PDFAnnotation.prototype.Rect = function () {
        return this.dict.lookup(PDFName.of('Rect'), PDFArray);
    };
    PDFAnnotation.prototype.AP = function () {
        return this.dict.lookupMaybe(PDFName.of('AP'), PDFDict);
    };
    PDFAnnotation.prototype.F = function () {
        var numberOrRef = this.dict.lookup(PDFName.of('F'));
        return this.dict.context.lookupMaybe(numberOrRef, PDFNumber);
    };
    PDFAnnotation.prototype.getRectangle = function () {
        var _a;
        var Rect = this.Rect();
        return (_a = Rect === null || Rect === void 0 ? void 0 : Rect.asRectangle()) !== null && _a !== void 0 ? _a : { x: 0, y: 0, width: 0, height: 0 };
    };
    PDFAnnotation.prototype.setRectangle = function (rect) {
        var x = rect.x, y = rect.y, width = rect.width, height = rect.height;
        var Rect = this.dict.context.obj([x, y, x + width, y + height]);
        this.dict.set(PDFName.of('Rect'), Rect);
    };
    PDFAnnotation.prototype.getAppearanceState = function () {
        var AS = this.dict.lookup(PDFName.of('AS'));
        if (AS instanceof PDFName)
            return AS;
        return undefined;
    };
    PDFAnnotation.prototype.setAppearanceState = function (state) {
        this.dict.set(PDFName.of('AS'), state);
    };
    PDFAnnotation.prototype.setAppearances = function (appearances) {
        this.dict.set(PDFName.of('AP'), appearances);
    };
    PDFAnnotation.prototype.ensureAP = function () {
        var AP = this.AP();
        if (!AP) {
            AP = this.dict.context.obj({});
            this.dict.set(PDFName.of('AP'), AP);
        }
        return AP;
    };
    PDFAnnotation.prototype.getNormalAppearance = function () {
        var AP = this.ensureAP();
        var N = AP.get(PDFName.of('N'));
        if (N instanceof PDFRef || N instanceof PDFDict)
            return N;
        throw new Error("Unexpected N type: " + (N === null || N === void 0 ? void 0 : N.constructor.name));
    };
    /** @param appearance A PDFDict or PDFStream (direct or ref) */
    PDFAnnotation.prototype.setNormalAppearance = function (appearance) {
        var AP = this.ensureAP();
        AP.set(PDFName.of('N'), appearance);
    };
    /** @param appearance A PDFDict or PDFStream (direct or ref) */
    PDFAnnotation.prototype.setRolloverAppearance = function (appearance) {
        var AP = this.ensureAP();
        AP.set(PDFName.of('R'), appearance);
    };
    /** @param appearance A PDFDict or PDFStream (direct or ref) */
    PDFAnnotation.prototype.setDownAppearance = function (appearance) {
        var AP = this.ensureAP();
        AP.set(PDFName.of('D'), appearance);
    };
    PDFAnnotation.prototype.removeRolloverAppearance = function () {
        var AP = this.AP();
        AP === null || AP === void 0 ? void 0 : AP.delete(PDFName.of('R'));
    };
    PDFAnnotation.prototype.removeDownAppearance = function () {
        var AP = this.AP();
        AP === null || AP === void 0 ? void 0 : AP.delete(PDFName.of('D'));
    };
    PDFAnnotation.prototype.getAppearances = function () {
        var AP = this.AP();
        if (!AP)
            return undefined;
        var N = AP.lookup(PDFName.of('N'), PDFDict, PDFStream);
        var R = AP.lookupMaybe(PDFName.of('R'), PDFDict, PDFStream);
        var D = AP.lookupMaybe(PDFName.of('D'), PDFDict, PDFStream);
        return { normal: N, rollover: R, down: D };
    };
    PDFAnnotation.prototype.getFlags = function () {
        var _a, _b;
        return (_b = (_a = this.F()) === null || _a === void 0 ? void 0 : _a.asNumber()) !== null && _b !== void 0 ? _b : 0;
    };
    PDFAnnotation.prototype.setFlags = function (flags) {
        this.dict.set(PDFName.of('F'), PDFNumber.of(flags));
    };
    PDFAnnotation.prototype.hasFlag = function (flag) {
        var flags = this.getFlags();
        return (flags & flag) !== 0;
    };
    PDFAnnotation.prototype.setFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags | flag);
    };
    PDFAnnotation.prototype.clearFlag = function (flag) {
        var flags = this.getFlags();
        this.setFlags(flags & ~flag);
    };
    PDFAnnotation.prototype.setFlagTo = function (flag, enable) {
        if (enable)
            this.setFlag(flag);
        else
            this.clearFlag(flag);
    };
    PDFAnnotation.fromDict = function (dict) { return new PDFAnnotation(dict); };
    return PDFAnnotation;
}());
export default PDFAnnotation;
//# sourceMappingURL=PDFAnnotation.js.map