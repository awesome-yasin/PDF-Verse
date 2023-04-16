import { __extends } from "tslib";
import PDFString from "../objects/PDFString";
import PDFHexString from "../objects/PDFHexString";
import PDFArray from "../objects/PDFArray";
import PDFName from "../objects/PDFName";
import PDFAcroTerminal from "./PDFAcroTerminal";
import { IndexOutOfBoundsError } from "../errors";
var PDFAcroButton = /** @class */ (function (_super) {
    __extends(PDFAcroButton, _super);
    function PDFAcroButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroButton.prototype.Opt = function () {
        return this.dict.lookupMaybe(PDFName.of('Opt'), PDFString, PDFHexString, PDFArray);
    };
    PDFAcroButton.prototype.setOpt = function (opt) {
        this.dict.set(PDFName.of('Opt'), this.dict.context.obj(opt));
    };
    PDFAcroButton.prototype.getExportValues = function () {
        var opt = this.Opt();
        if (!opt)
            return undefined;
        if (opt instanceof PDFString || opt instanceof PDFHexString) {
            return [opt];
        }
        var values = [];
        for (var idx = 0, len = opt.size(); idx < len; idx++) {
            var value = opt.lookup(idx);
            if (value instanceof PDFString || value instanceof PDFHexString) {
                values.push(value);
            }
        }
        return values;
    };
    PDFAcroButton.prototype.removeExportValue = function (idx) {
        var opt = this.Opt();
        if (!opt)
            return;
        if (opt instanceof PDFString || opt instanceof PDFHexString) {
            if (idx !== 0)
                throw new IndexOutOfBoundsError(idx, 0, 0);
            this.setOpt([]);
        }
        else {
            if (idx < 0 || idx > opt.size()) {
                throw new IndexOutOfBoundsError(idx, 0, opt.size());
            }
            opt.remove(idx);
        }
    };
    // Enforce use use of /Opt even if it isn't strictly necessary
    PDFAcroButton.prototype.normalizeExportValues = function () {
        var _a, _b, _c, _d;
        var exportValues = (_a = this.getExportValues()) !== null && _a !== void 0 ? _a : [];
        var Opt = [];
        var widgets = this.getWidgets();
        for (var idx = 0, len = widgets.length; idx < len; idx++) {
            var widget = widgets[idx];
            var exportVal = (_b = exportValues[idx]) !== null && _b !== void 0 ? _b : PDFHexString.fromText((_d = (_c = widget.getOnValue()) === null || _c === void 0 ? void 0 : _c.decodeText()) !== null && _d !== void 0 ? _d : '');
            Opt.push(exportVal);
        }
        this.setOpt(Opt);
    };
    /**
     * Reuses existing opt if one exists with the same value (assuming
     * `useExistingIdx` is `true`). Returns index of existing (or new) opt.
     */
    PDFAcroButton.prototype.addOpt = function (opt, useExistingOptIdx) {
        var _a;
        this.normalizeExportValues();
        var optText = opt.decodeText();
        var existingIdx;
        if (useExistingOptIdx) {
            var exportValues = (_a = this.getExportValues()) !== null && _a !== void 0 ? _a : [];
            for (var idx = 0, len = exportValues.length; idx < len; idx++) {
                var exportVal = exportValues[idx];
                if (exportVal.decodeText() === optText)
                    existingIdx = idx;
            }
        }
        var Opt = this.Opt();
        Opt.push(opt);
        return existingIdx !== null && existingIdx !== void 0 ? existingIdx : Opt.size() - 1;
    };
    PDFAcroButton.prototype.addWidgetWithOpt = function (widget, opt, useExistingOptIdx) {
        var optIdx = this.addOpt(opt, useExistingOptIdx);
        var apStateValue = PDFName.of(String(optIdx));
        this.addWidget(widget);
        return apStateValue;
    };
    return PDFAcroButton;
}(PDFAcroTerminal));
export default PDFAcroButton;
//# sourceMappingURL=PDFAcroButton.js.map