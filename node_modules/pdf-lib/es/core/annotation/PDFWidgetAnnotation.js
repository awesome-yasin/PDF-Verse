import { __extends } from "tslib";
import PDFDict from "../objects/PDFDict";
import PDFName from "../objects/PDFName";
import PDFRef from "../objects/PDFRef";
import PDFString from "../objects/PDFString";
import PDFHexString from "../objects/PDFHexString";
import BorderStyle from "./BorderStyle";
import PDFAnnotation from "./PDFAnnotation";
import AppearanceCharacteristics from "./AppearanceCharacteristics";
var PDFWidgetAnnotation = /** @class */ (function (_super) {
    __extends(PDFWidgetAnnotation, _super);
    function PDFWidgetAnnotation() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFWidgetAnnotation.prototype.MK = function () {
        var MK = this.dict.lookup(PDFName.of('MK'));
        if (MK instanceof PDFDict)
            return MK;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.BS = function () {
        var BS = this.dict.lookup(PDFName.of('BS'));
        if (BS instanceof PDFDict)
            return BS;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.DA = function () {
        var da = this.dict.lookup(PDFName.of('DA'));
        if (da instanceof PDFString || da instanceof PDFHexString)
            return da;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.P = function () {
        var P = this.dict.get(PDFName.of('P'));
        if (P instanceof PDFRef)
            return P;
        return undefined;
    };
    PDFWidgetAnnotation.prototype.setP = function (page) {
        this.dict.set(PDFName.of('P'), page);
    };
    PDFWidgetAnnotation.prototype.setDefaultAppearance = function (appearance) {
        this.dict.set(PDFName.of('DA'), PDFString.of(appearance));
    };
    PDFWidgetAnnotation.prototype.getDefaultAppearance = function () {
        var DA = this.DA();
        if (DA instanceof PDFHexString) {
            return DA.decodeText();
        }
        return DA === null || DA === void 0 ? void 0 : DA.asString();
    };
    PDFWidgetAnnotation.prototype.getAppearanceCharacteristics = function () {
        var MK = this.MK();
        if (MK)
            return AppearanceCharacteristics.fromDict(MK);
        return undefined;
    };
    PDFWidgetAnnotation.prototype.getOrCreateAppearanceCharacteristics = function () {
        var MK = this.MK();
        if (MK)
            return AppearanceCharacteristics.fromDict(MK);
        var ac = AppearanceCharacteristics.fromDict(this.dict.context.obj({}));
        this.dict.set(PDFName.of('MK'), ac.dict);
        return ac;
    };
    PDFWidgetAnnotation.prototype.getBorderStyle = function () {
        var BS = this.BS();
        if (BS)
            return BorderStyle.fromDict(BS);
        return undefined;
    };
    PDFWidgetAnnotation.prototype.getOrCreateBorderStyle = function () {
        var BS = this.BS();
        if (BS)
            return BorderStyle.fromDict(BS);
        var bs = BorderStyle.fromDict(this.dict.context.obj({}));
        this.dict.set(PDFName.of('BS'), bs.dict);
        return bs;
    };
    PDFWidgetAnnotation.prototype.getOnValue = function () {
        var _a;
        var normal = (_a = this.getAppearances()) === null || _a === void 0 ? void 0 : _a.normal;
        if (normal instanceof PDFDict) {
            var keys = normal.keys();
            for (var idx = 0, len = keys.length; idx < len; idx++) {
                var key = keys[idx];
                if (key !== PDFName.of('Off'))
                    return key;
            }
        }
        return undefined;
    };
    PDFWidgetAnnotation.fromDict = function (dict) {
        return new PDFWidgetAnnotation(dict);
    };
    PDFWidgetAnnotation.create = function (context, parent) {
        var dict = context.obj({
            Type: 'Annot',
            Subtype: 'Widget',
            Rect: [0, 0, 0, 0],
            Parent: parent,
        });
        return new PDFWidgetAnnotation(dict);
    };
    return PDFWidgetAnnotation;
}(PDFAnnotation));
export default PDFWidgetAnnotation;
//# sourceMappingURL=PDFWidgetAnnotation.js.map