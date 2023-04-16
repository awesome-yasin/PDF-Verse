import { __extends } from "tslib";
import PDFName from "../objects/PDFName";
import PDFAcroButton from "./PDFAcroButton";
import { InvalidAcroFieldValueError } from "../errors";
var PDFAcroCheckBox = /** @class */ (function (_super) {
    __extends(PDFAcroCheckBox, _super);
    function PDFAcroCheckBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroCheckBox.prototype.setValue = function (value) {
        var _a;
        var onValue = (_a = this.getOnValue()) !== null && _a !== void 0 ? _a : PDFName.of('Yes');
        if (value !== onValue && value !== PDFName.of('Off')) {
            throw new InvalidAcroFieldValueError();
        }
        this.dict.set(PDFName.of('V'), value);
        var widgets = this.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var state = widget.getOnValue() === value ? value : PDFName.of('Off');
            widget.setAppearanceState(state);
        }
    };
    PDFAcroCheckBox.prototype.getValue = function () {
        var v = this.V();
        if (v instanceof PDFName)
            return v;
        return PDFName.of('Off');
    };
    PDFAcroCheckBox.prototype.getOnValue = function () {
        var widget = this.getWidgets()[0];
        return widget === null || widget === void 0 ? void 0 : widget.getOnValue();
    };
    PDFAcroCheckBox.fromDict = function (dict, ref) {
        return new PDFAcroCheckBox(dict, ref);
    };
    PDFAcroCheckBox.create = function (context) {
        var dict = context.obj({
            FT: 'Btn',
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroCheckBox(dict, ref);
    };
    return PDFAcroCheckBox;
}(PDFAcroButton));
export default PDFAcroCheckBox;
//# sourceMappingURL=PDFAcroCheckBox.js.map