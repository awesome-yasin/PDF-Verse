import { __extends } from "tslib";
import PDFName from "../objects/PDFName";
import PDFAcroButton from "./PDFAcroButton";
import { AcroButtonFlags } from "./flags";
import { InvalidAcroFieldValueError } from "../errors";
var PDFAcroRadioButton = /** @class */ (function (_super) {
    __extends(PDFAcroRadioButton, _super);
    function PDFAcroRadioButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroRadioButton.prototype.setValue = function (value) {
        var onValues = this.getOnValues();
        if (!onValues.includes(value) && value !== PDFName.of('Off')) {
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
    PDFAcroRadioButton.prototype.getValue = function () {
        var v = this.V();
        if (v instanceof PDFName)
            return v;
        return PDFName.of('Off');
    };
    PDFAcroRadioButton.prototype.getOnValues = function () {
        var widgets = this.getWidgets();
        var onValues = [];
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var onValue = widgets[idx].getOnValue();
            if (onValue)
                onValues.push(onValue);
        }
        return onValues;
    };
    PDFAcroRadioButton.fromDict = function (dict, ref) {
        return new PDFAcroRadioButton(dict, ref);
    };
    PDFAcroRadioButton.create = function (context) {
        var dict = context.obj({
            FT: 'Btn',
            Ff: AcroButtonFlags.Radio,
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroRadioButton(dict, ref);
    };
    return PDFAcroRadioButton;
}(PDFAcroButton));
export default PDFAcroRadioButton;
//# sourceMappingURL=PDFAcroRadioButton.js.map