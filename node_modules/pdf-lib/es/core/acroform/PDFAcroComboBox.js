import { __extends } from "tslib";
import PDFAcroChoice from "./PDFAcroChoice";
import { AcroChoiceFlags } from "./flags";
var PDFAcroComboBox = /** @class */ (function (_super) {
    __extends(PDFAcroComboBox, _super);
    function PDFAcroComboBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroComboBox.fromDict = function (dict, ref) {
        return new PDFAcroComboBox(dict, ref);
    };
    PDFAcroComboBox.create = function (context) {
        var dict = context.obj({
            FT: 'Ch',
            Ff: AcroChoiceFlags.Combo,
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroComboBox(dict, ref);
    };
    return PDFAcroComboBox;
}(PDFAcroChoice));
export default PDFAcroComboBox;
//# sourceMappingURL=PDFAcroComboBox.js.map