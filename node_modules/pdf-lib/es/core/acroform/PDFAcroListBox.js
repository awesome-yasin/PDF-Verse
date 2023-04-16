import { __extends } from "tslib";
import PDFAcroChoice from "./PDFAcroChoice";
var PDFAcroListBox = /** @class */ (function (_super) {
    __extends(PDFAcroListBox, _super);
    function PDFAcroListBox() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroListBox.fromDict = function (dict, ref) {
        return new PDFAcroListBox(dict, ref);
    };
    PDFAcroListBox.create = function (context) {
        var dict = context.obj({
            FT: 'Ch',
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroListBox(dict, ref);
    };
    return PDFAcroListBox;
}(PDFAcroChoice));
export default PDFAcroListBox;
//# sourceMappingURL=PDFAcroListBox.js.map