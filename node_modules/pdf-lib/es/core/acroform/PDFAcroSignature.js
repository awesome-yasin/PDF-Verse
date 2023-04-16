import { __extends } from "tslib";
import PDFAcroTerminal from "./PDFAcroTerminal";
var PDFAcroSignature = /** @class */ (function (_super) {
    __extends(PDFAcroSignature, _super);
    function PDFAcroSignature() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PDFAcroSignature.fromDict = function (dict, ref) {
        return new PDFAcroSignature(dict, ref);
    };
    return PDFAcroSignature;
}(PDFAcroTerminal));
export default PDFAcroSignature;
//# sourceMappingURL=PDFAcroSignature.js.map