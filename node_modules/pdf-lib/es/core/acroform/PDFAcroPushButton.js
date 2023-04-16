import { __extends } from "tslib";
import PDFAcroButton from "./PDFAcroButton";
import { AcroButtonFlags } from "./flags";
var PDFAcroPushButton = /** @class */ (function (_super) {
    __extends(PDFAcroPushButton, _super);
    function PDFAcroPushButton() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroPushButton.fromDict = function (dict, ref) {
        return new PDFAcroPushButton(dict, ref);
    };
    PDFAcroPushButton.create = function (context) {
        var dict = context.obj({
            FT: 'Btn',
            Ff: AcroButtonFlags.PushButton,
            Kids: [],
        });
        var ref = context.register(dict);
        return new PDFAcroPushButton(dict, ref);
    };
    return PDFAcroPushButton;
}(PDFAcroButton));
export default PDFAcroPushButton;
//# sourceMappingURL=PDFAcroPushButton.js.map