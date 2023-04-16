import { __extends } from "tslib";
import PDFDict from "../objects/PDFDict";
import PDFName from "../objects/PDFName";
import PDFAcroField from "./PDFAcroField";
import PDFWidgetAnnotation from "../annotation/PDFWidgetAnnotation";
import { IndexOutOfBoundsError } from "../errors";
var PDFAcroTerminal = /** @class */ (function (_super) {
    __extends(PDFAcroTerminal, _super);
    function PDFAcroTerminal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroTerminal.prototype.FT = function () {
        var nameOrRef = this.getInheritableAttribute(PDFName.of('FT'));
        return this.dict.context.lookup(nameOrRef, PDFName);
    };
    PDFAcroTerminal.prototype.getWidgets = function () {
        var kidDicts = this.Kids();
        // This field is itself a widget
        if (!kidDicts)
            return [PDFWidgetAnnotation.fromDict(this.dict)];
        // This field's kids are its widgets
        var widgets = new Array(kidDicts.size());
        for (var idx = 0, len = kidDicts.size(); idx < len; idx++) {
            var dict = kidDicts.lookup(idx, PDFDict);
            widgets[idx] = PDFWidgetAnnotation.fromDict(dict);
        }
        return widgets;
    };
    PDFAcroTerminal.prototype.addWidget = function (ref) {
        var Kids = this.normalizedEntries().Kids;
        Kids.push(ref);
    };
    PDFAcroTerminal.prototype.removeWidget = function (idx) {
        var kidDicts = this.Kids();
        if (!kidDicts) {
            // This field is itself a widget
            if (idx !== 0)
                throw new IndexOutOfBoundsError(idx, 0, 0);
            this.setKids([]);
        }
        else {
            // This field's kids are its widgets
            if (idx < 0 || idx > kidDicts.size()) {
                throw new IndexOutOfBoundsError(idx, 0, kidDicts.size());
            }
            kidDicts.remove(idx);
        }
    };
    PDFAcroTerminal.prototype.normalizedEntries = function () {
        var Kids = this.Kids();
        // If this field is itself a widget (because it was only rendered once in
        // the document, so the field and widget properties were merged) then we
        // add itself to the `Kids` array. The alternative would be to try
        // splitting apart the widget properties and creating a separate object
        // for them.
        if (!Kids) {
            Kids = this.dict.context.obj([this.ref]);
            this.dict.set(PDFName.of('Kids'), Kids);
        }
        return { Kids: Kids };
    };
    PDFAcroTerminal.fromDict = function (dict, ref) {
        return new PDFAcroTerminal(dict, ref);
    };
    return PDFAcroTerminal;
}(PDFAcroField));
export default PDFAcroTerminal;
//# sourceMappingURL=PDFAcroTerminal.js.map