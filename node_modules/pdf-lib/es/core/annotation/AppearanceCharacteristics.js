import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFArray from "../objects/PDFArray";
import PDFHexString from "../objects/PDFHexString";
import PDFString from "../objects/PDFString";
var AppearanceCharacteristics = /** @class */ (function () {
    function AppearanceCharacteristics(dict) {
        this.dict = dict;
    }
    AppearanceCharacteristics.prototype.R = function () {
        var R = this.dict.lookup(PDFName.of('R'));
        if (R instanceof PDFNumber)
            return R;
        return undefined;
    };
    AppearanceCharacteristics.prototype.BC = function () {
        var BC = this.dict.lookup(PDFName.of('BC'));
        if (BC instanceof PDFArray)
            return BC;
        return undefined;
    };
    AppearanceCharacteristics.prototype.BG = function () {
        var BG = this.dict.lookup(PDFName.of('BG'));
        if (BG instanceof PDFArray)
            return BG;
        return undefined;
    };
    AppearanceCharacteristics.prototype.CA = function () {
        var CA = this.dict.lookup(PDFName.of('CA'));
        if (CA instanceof PDFHexString || CA instanceof PDFString)
            return CA;
        return undefined;
    };
    AppearanceCharacteristics.prototype.RC = function () {
        var RC = this.dict.lookup(PDFName.of('RC'));
        if (RC instanceof PDFHexString || RC instanceof PDFString)
            return RC;
        return undefined;
    };
    AppearanceCharacteristics.prototype.AC = function () {
        var AC = this.dict.lookup(PDFName.of('AC'));
        if (AC instanceof PDFHexString || AC instanceof PDFString)
            return AC;
        return undefined;
    };
    AppearanceCharacteristics.prototype.getRotation = function () {
        var _a;
        return (_a = this.R()) === null || _a === void 0 ? void 0 : _a.asNumber();
    };
    AppearanceCharacteristics.prototype.getBorderColor = function () {
        var BC = this.BC();
        if (!BC)
            return undefined;
        var components = [];
        for (var idx = 0, len = BC === null || BC === void 0 ? void 0 : BC.size(); idx < len; idx++) {
            var component = BC.get(idx);
            if (component instanceof PDFNumber)
                components.push(component.asNumber());
        }
        return components;
    };
    AppearanceCharacteristics.prototype.getBackgroundColor = function () {
        var BG = this.BG();
        if (!BG)
            return undefined;
        var components = [];
        for (var idx = 0, len = BG === null || BG === void 0 ? void 0 : BG.size(); idx < len; idx++) {
            var component = BG.get(idx);
            if (component instanceof PDFNumber)
                components.push(component.asNumber());
        }
        return components;
    };
    AppearanceCharacteristics.prototype.getCaptions = function () {
        var CA = this.CA();
        var RC = this.RC();
        var AC = this.AC();
        return {
            normal: CA === null || CA === void 0 ? void 0 : CA.decodeText(),
            rollover: RC === null || RC === void 0 ? void 0 : RC.decodeText(),
            down: AC === null || AC === void 0 ? void 0 : AC.decodeText(),
        };
    };
    AppearanceCharacteristics.prototype.setRotation = function (rotation) {
        var R = this.dict.context.obj(rotation);
        this.dict.set(PDFName.of('R'), R);
    };
    AppearanceCharacteristics.prototype.setBorderColor = function (color) {
        var BC = this.dict.context.obj(color);
        this.dict.set(PDFName.of('BC'), BC);
    };
    AppearanceCharacteristics.prototype.setBackgroundColor = function (color) {
        var BG = this.dict.context.obj(color);
        this.dict.set(PDFName.of('BG'), BG);
    };
    AppearanceCharacteristics.prototype.setCaptions = function (captions) {
        var CA = PDFHexString.fromText(captions.normal);
        this.dict.set(PDFName.of('CA'), CA);
        if (captions.rollover) {
            var RC = PDFHexString.fromText(captions.rollover);
            this.dict.set(PDFName.of('RC'), RC);
        }
        else {
            this.dict.delete(PDFName.of('RC'));
        }
        if (captions.down) {
            var AC = PDFHexString.fromText(captions.down);
            this.dict.set(PDFName.of('AC'), AC);
        }
        else {
            this.dict.delete(PDFName.of('AC'));
        }
    };
    AppearanceCharacteristics.fromDict = function (dict) {
        return new AppearanceCharacteristics(dict);
    };
    return AppearanceCharacteristics;
}());
export default AppearanceCharacteristics;
//# sourceMappingURL=AppearanceCharacteristics.js.map