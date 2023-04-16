import { __awaiter, __generator } from "tslib";
import PDFHexString from "../objects/PDFHexString";
var JavaScriptEmbedder = /** @class */ (function () {
    function JavaScriptEmbedder(script, scriptName) {
        this.script = script;
        this.scriptName = scriptName;
    }
    JavaScriptEmbedder.for = function (script, scriptName) {
        return new JavaScriptEmbedder(script, scriptName);
    };
    JavaScriptEmbedder.prototype.embedIntoContext = function (context, ref) {
        return __awaiter(this, void 0, void 0, function () {
            var jsActionDict;
            return __generator(this, function (_a) {
                jsActionDict = context.obj({
                    Type: 'Action',
                    S: 'JavaScript',
                    JS: PDFHexString.fromText(this.script),
                });
                if (ref) {
                    context.assign(ref, jsActionDict);
                    return [2 /*return*/, ref];
                }
                else {
                    return [2 /*return*/, context.register(jsActionDict)];
                }
                return [2 /*return*/];
            });
        });
    };
    return JavaScriptEmbedder;
}());
export default JavaScriptEmbedder;
//# sourceMappingURL=JavaScriptEmbedder.js.map