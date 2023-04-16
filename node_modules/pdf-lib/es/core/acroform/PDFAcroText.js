import { __extends } from "tslib";
import PDFNumber from "../objects/PDFNumber";
import PDFString from "../objects/PDFString";
import PDFHexString from "../objects/PDFHexString";
import PDFName from "../objects/PDFName";
import PDFAcroTerminal from "./PDFAcroTerminal";
var PDFAcroText = /** @class */ (function (_super) {
    __extends(PDFAcroText, _super);
    function PDFAcroText() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroText.prototype.MaxLen = function () {
        var maxLen = this.dict.lookup(PDFName.of('MaxLen'));
        if (maxLen instanceof PDFNumber)
            return maxLen;
        return undefined;
    };
    PDFAcroText.prototype.Q = function () {
        var q = this.dict.lookup(PDFName.of('Q'));
        if (q instanceof PDFNumber)
            return q;
        return undefined;
    };
    PDFAcroText.prototype.setMaxLength = function (maxLength) {
        this.dict.set(PDFName.of('MaxLen'), PDFNumber.of(maxLength));
    };
    PDFAcroText.prototype.removeMaxLength = function () {
        this.dict.delete(PDFName.of('MaxLen'));
    };
    PDFAcroText.prototype.getMaxLength = function () {
        var _a;
        return (_a = this.MaxLen()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    PDFAcroText.prototype.setQuadding = function (quadding) {
        this.dict.set(PDFName.of('Q'), PDFNumber.of(quadding));
    };
    PDFAcroText.prototype.getQuadding = function () {
        var _a;
        return (_a = this.Q()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    PDFAcroText.prototype.setValue = function (value) {
        this.dict.set(PDFName.of('V'), value);
        // const widgets = this.getWidgets();
        // for (let idx = 0, len = widgets.length; idx < len; idx++) {
        //   const widget = widgets[idx];
        //   const state = widget.getOnValue() === value ? value : PDFName.of('Off');
        //   widget.setAppearanceState(state);
        // }
    };
    PDFAcroText.prototype.removeValue = function () {
        this.dict.delete(PDFName.of('V'));
    };
    PDFAcroText.prototype.getValue = function () {
        var v = this.V();
        if (v instanceof PDFString || v instanceof PDFHexString)
            return v;
        return undefined;
    };
    PDFAcroText.fromDict = function (dict, ref) { return new PDFAcroText(dict, ref); };
    PDFAcroText.create = function (context) {
        var dict = context.obj({
            FT: 'Tx',
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroText(dict, ref);
    };
    return PDFAcroText;
}(PDFAcroTerminal));
export default PDFAcroText;
//# sourceMappingURL=PDFAcroText.js.map