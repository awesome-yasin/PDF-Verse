import { __extends } from "tslib";
import PDFField from "./PDFField";
import { PDFAcroSignature } from "../../core";
import { assertIs } from "../../utils";
/**
 * Represents a signature field of a [[PDFForm]].
 *
 * [[PDFSignature]] fields are digital signatures. `pdf-lib` does not
 * currently provide any specialized APIs for creating digital signatures or
 * reading the contents of existing digital signatures.
 */
var PDFSignature = /** @class */ (function (_super) {
    __extends(PDFSignature, _super);
    function PDFSignature(acroSignature, ref, doc) {
        var _this = _super.call(this, acroSignature, ref, doc) || this;
        assertIs(acroSignature, 'acroSignature', [
            [PDFAcroSignature, 'PDFAcroSignature'],
        ]);
        _this.acroField = acroSignature;
        return _this;
    }
    PDFSignature.prototype.needsAppearancesUpdate = function () {
        return false;
    };
    /**
     * > **NOTE:** You probably don't want to call this method directly. Instead,
     * > consider using the [[PDFForm.getSignature]] method, which will create an
     * > instance of [[PDFSignature]] for you.
     *
     * Create an instance of [[PDFSignature]] from an existing acroSignature and
     * ref
     *
     * @param acroSignature The underlying `PDFAcroSignature` for this signature.
     * @param ref The unique reference for this signature.
     * @param doc The document to which this signature will belong.
     */
    PDFSignature.of = function (acroSignature, ref, doc) { return new PDFSignature(acroSignature, ref, doc); };
    return PDFSignature;
}(PDFField));
export default PDFSignature;
//# sourceMappingURL=PDFSignature.js.map