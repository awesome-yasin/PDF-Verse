import { __extends } from "tslib";
import PDFName from "../objects/PDFName";
import PDFAcroField from "./PDFAcroField";
var PDFAcroNonTerminal = /** @class */ (function (_super) {
    __extends(PDFAcroNonTerminal, _super);
    function PDFAcroNonTerminal() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroNonTerminal.prototype.addField = function (field) {
        var Kids = this.normalizedEntries().Kids;
        Kids === null || Kids === void 0 ? void 0 : Kids.push(field);
    };
    PDFAcroNonTerminal.prototype.normalizedEntries = function () {
        var Kids = this.Kids();
        if (!Kids) {
            Kids = this.dict.context.obj([]);
            this.dict.set(PDFName.of('Kids'), Kids);
        }
        return { Kids: Kids };
    };
    PDFAcroNonTerminal.fromDict = function (dict, ref) {
        return new PDFAcroNonTerminal(dict, ref);
    };
    PDFAcroNonTerminal.create = function (context) {
        var dict = context.obj({});
        var ref = context.register(dict);
        return new PDFAcroNonTerminal(dict, ref);
    };
    return PDFAcroNonTerminal;
}(PDFAcroField));
export default PDFAcroNonTerminal;
//# sourceMappingURL=PDFAcroNonTerminal.js.map