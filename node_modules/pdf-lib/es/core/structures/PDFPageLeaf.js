import { __extends } from "tslib";
import PDFArray from "../objects/PDFArray";
import PDFDict from "../objects/PDFDict";
import PDFName from "../objects/PDFName";
import PDFNumber from "../objects/PDFNumber";
import PDFStream from "../objects/PDFStream";
var PDFPageLeaf = /** @class */ (function (_super) {
    __extends(PDFPageLeaf, _super);
    function PDFPageLeaf(map, context, autoNormalizeCTM) {
        if (autoNormalizeCTM === void 0) { autoNormalizeCTM = true; }
        var _this = _super.call(this, map, context) || this;
        _this.normalized = false;
        _this.autoNormalizeCTM = autoNormalizeCTM;
        return _this;
    }
    PDFPageLeaf.prototype.clone = function (context) {
        var clone = PDFPageLeaf.fromMapWithContext(new Map(), context || this.context, this.autoNormalizeCTM);
        var entries = this.entries();
        for (var idx = 0, len = entries.length; idx < len; idx++) {
            var _a = entries[idx], key = _a[0], value = _a[1];
            clone.set(key, value);
        }
        return clone;
    };
    PDFPageLeaf.prototype.Parent = function () {
        return this.lookupMaybe(PDFName.Parent, PDFDict);
    };
    PDFPageLeaf.prototype.Contents = function () {
        return this.lookup(PDFName.of('Contents'));
    };
    PDFPageLeaf.prototype.Annots = function () {
        return this.lookupMaybe(PDFName.Annots, PDFArray);
    };
    PDFPageLeaf.prototype.BleedBox = function () {
        return this.lookupMaybe(PDFName.BleedBox, PDFArray);
    };
    PDFPageLeaf.prototype.TrimBox = function () {
        return this.lookupMaybe(PDFName.TrimBox, PDFArray);
    };
    PDFPageLeaf.prototype.ArtBox = function () {
        return this.lookupMaybe(PDFName.ArtBox, PDFArray);
    };
    PDFPageLeaf.prototype.Resources = function () {
        var dictOrRef = this.getInheritableAttribute(PDFName.Resources);
        return this.context.lookupMaybe(dictOrRef, PDFDict);
    };
    PDFPageLeaf.prototype.MediaBox = function () {
        var arrayOrRef = this.getInheritableAttribute(PDFName.MediaBox);
        return this.context.lookup(arrayOrRef, PDFArray);
    };
    PDFPageLeaf.prototype.CropBox = function () {
        var arrayOrRef = this.getInheritableAttribute(PDFName.CropBox);
        return this.context.lookupMaybe(arrayOrRef, PDFArray);
    };
    PDFPageLeaf.prototype.Rotate = function () {
        var numberOrRef = this.getInheritableAttribute(PDFName.Rotate);
        return this.context.lookupMaybe(numberOrRef, PDFNumber);
    };
    PDFPageLeaf.prototype.getInheritableAttribute = function (name) {
        var attribute;
        this.ascend(function (node) {
            if (!attribute)
                attribute = node.get(name);
        });
        return attribute;
    };
    PDFPageLeaf.prototype.setParent = function (parentRef) {
        this.set(PDFName.Parent, parentRef);
    };
    PDFPageLeaf.prototype.addContentStream = function (contentStreamRef) {
        var Contents = this.normalizedEntries().Contents || this.context.obj([]);
        this.set(PDFName.Contents, Contents);
        Contents.push(contentStreamRef);
    };
    PDFPageLeaf.prototype.wrapContentStreams = function (startStream, endStream) {
        var Contents = this.Contents();
        if (Contents instanceof PDFArray) {
            Contents.insert(0, startStream);
            Contents.push(endStream);
            return true;
        }
        return false;
    };
    PDFPageLeaf.prototype.addAnnot = function (annotRef) {
        var Annots = this.normalizedEntries().Annots;
        Annots.push(annotRef);
    };
    PDFPageLeaf.prototype.removeAnnot = function (annotRef) {
        var Annots = this.normalizedEntries().Annots;
        var index = Annots.indexOf(annotRef);
        if (index !== undefined) {
            Annots.remove(index);
        }
    };
    PDFPageLeaf.prototype.setFontDictionary = function (name, fontDictRef) {
        var Font = this.normalizedEntries().Font;
        Font.set(name, fontDictRef);
    };
    PDFPageLeaf.prototype.newFontDictionaryKey = function (tag) {
        var Font = this.normalizedEntries().Font;
        return Font.uniqueKey(tag);
    };
    PDFPageLeaf.prototype.newFontDictionary = function (tag, fontDictRef) {
        var key = this.newFontDictionaryKey(tag);
        this.setFontDictionary(key, fontDictRef);
        return key;
    };
    PDFPageLeaf.prototype.setXObject = function (name, xObjectRef) {
        var XObject = this.normalizedEntries().XObject;
        XObject.set(name, xObjectRef);
    };
    PDFPageLeaf.prototype.newXObjectKey = function (tag) {
        var XObject = this.normalizedEntries().XObject;
        return XObject.uniqueKey(tag);
    };
    PDFPageLeaf.prototype.newXObject = function (tag, xObjectRef) {
        var key = this.newXObjectKey(tag);
        this.setXObject(key, xObjectRef);
        return key;
    };
    PDFPageLeaf.prototype.setExtGState = function (name, extGStateRef) {
        var ExtGState = this.normalizedEntries().ExtGState;
        ExtGState.set(name, extGStateRef);
    };
    PDFPageLeaf.prototype.newExtGStateKey = function (tag) {
        var ExtGState = this.normalizedEntries().ExtGState;
        return ExtGState.uniqueKey(tag);
    };
    PDFPageLeaf.prototype.newExtGState = function (tag, extGStateRef) {
        var key = this.newExtGStateKey(tag);
        this.setExtGState(key, extGStateRef);
        return key;
    };
    PDFPageLeaf.prototype.ascend = function (visitor) {
        visitor(this);
        var Parent = this.Parent();
        if (Parent)
            Parent.ascend(visitor);
    };
    PDFPageLeaf.prototype.normalize = function () {
        if (this.normalized)
            return;
        var context = this.context;
        var contentsRef = this.get(PDFName.Contents);
        var contents = this.context.lookup(contentsRef);
        if (contents instanceof PDFStream) {
            this.set(PDFName.Contents, context.obj([contentsRef]));
        }
        if (this.autoNormalizeCTM) {
            this.wrapContentStreams(this.context.getPushGraphicsStateContentStream(), this.context.getPopGraphicsStateContentStream());
        }
        // TODO: Clone `Resources` if it is inherited
        var dictOrRef = this.getInheritableAttribute(PDFName.Resources);
        var Resources = context.lookupMaybe(dictOrRef, PDFDict) || context.obj({});
        this.set(PDFName.Resources, Resources);
        // TODO: Clone `Font` if it is inherited
        var Font = Resources.lookupMaybe(PDFName.Font, PDFDict) || context.obj({});
        Resources.set(PDFName.Font, Font);
        // TODO: Clone `XObject` if it is inherited
        var XObject = Resources.lookupMaybe(PDFName.XObject, PDFDict) || context.obj({});
        Resources.set(PDFName.XObject, XObject);
        // TODO: Clone `ExtGState` if it is inherited
        var ExtGState = Resources.lookupMaybe(PDFName.ExtGState, PDFDict) || context.obj({});
        Resources.set(PDFName.ExtGState, ExtGState);
        var Annots = this.Annots() || context.obj([]);
        this.set(PDFName.Annots, Annots);
        this.normalized = true;
    };
    PDFPageLeaf.prototype.normalizedEntries = function () {
        this.normalize();
        var Annots = this.Annots();
        var Resources = this.Resources();
        var Contents = this.Contents();
        return {
            Annots: Annots,
            Resources: Resources,
            Contents: Contents,
            Font: Resources.lookup(PDFName.Font, PDFDict),
            XObject: Resources.lookup(PDFName.XObject, PDFDict),
            ExtGState: Resources.lookup(PDFName.ExtGState, PDFDict),
        };
    };
    PDFPageLeaf.InheritableEntries = [
        'Resources',
        'MediaBox',
        'CropBox',
        'Rotate',
    ];
    PDFPageLeaf.withContextAndParent = function (context, parent) {
        var dict = new Map();
        dict.set(PDFName.Type, PDFName.Page);
        dict.set(PDFName.Parent, parent);
        dict.set(PDFName.Resources, context.obj({}));
        dict.set(PDFName.MediaBox, context.obj([0, 0, 612, 792]));
        return new PDFPageLeaf(dict, context, false);
    };
    PDFPageLeaf.fromMapWithContext = function (map, context, autoNormalizeCTM) {
        if (autoNormalizeCTM === void 0) { autoNormalizeCTM = true; }
        return new PDFPageLeaf(map, context, autoNormalizeCTM);
    };
    return PDFPageLeaf;
}(PDFDict));
export default PDFPageLeaf;
//# sourceMappingURL=PDFPageLeaf.js.map