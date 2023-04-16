import PDFNumber from "../objects/PDFNumber";
import PDFDict from "../objects/PDFDict";
import PDFName from "../objects/PDFName";
import PDFArray from "../objects/PDFArray";
import PDFRef from "../objects/PDFRef";
import PDFAcroTerminal from "./PDFAcroTerminal";
import PDFAcroNonTerminal from "./PDFAcroNonTerminal";
import PDFAcroSignature from "./PDFAcroSignature";
import PDFAcroText from "./PDFAcroText";
import PDFAcroPushButton from "./PDFAcroPushButton";
import PDFAcroRadioButton from "./PDFAcroRadioButton";
import PDFAcroCheckBox from "./PDFAcroCheckBox";
import PDFAcroComboBox from "./PDFAcroComboBox";
import PDFAcroListBox from "./PDFAcroListBox";
import { AcroButtonFlags, AcroChoiceFlags } from "./flags";
export var createPDFAcroFields = function (kidDicts) {
    if (!kidDicts)
        return [];
    var kids = [];
    for (var idx = 0, len = kidDicts.size(); idx < len; idx++) {
        var ref = kidDicts.get(idx);
        var dict = kidDicts.lookup(idx);
        // if (dict instanceof PDFDict) kids.push(PDFAcroField.fromDict(dict));
        if (ref instanceof PDFRef && dict instanceof PDFDict) {
            kids.push([createPDFAcroField(dict, ref), ref]);
        }
    }
    return kids;
};
export var createPDFAcroField = function (dict, ref) {
    var isNonTerminal = isNonTerminalAcroField(dict);
    if (isNonTerminal)
        return PDFAcroNonTerminal.fromDict(dict, ref);
    return createPDFAcroTerminal(dict, ref);
};
// TODO: Maybe just check if the dict is *not* a widget? That might be better.
// According to the PDF spec:
//
//   > A field's children in the hierarchy may also include widget annotations
//   > that define its appearance on the page. A field that has children that
//   > are fields is called a non-terminal field. A field that does not have
//   > children that are fields is called a terminal field.
//
// The spec is not entirely clear about how to determine whether a given
// dictionary represents an acrofield or a widget annotation. So we will assume
// that a dictionary is an acrofield if it is a member of the `/Kids` array
// and it contains a `/T` entry (widgets do not have `/T` entries). This isn't
// a bullet proof solution, because the `/T` entry is technically defined as
// optional for acrofields by the PDF spec. But in practice all acrofields seem
// to have a `/T` entry defined.
var isNonTerminalAcroField = function (dict) {
    var kids = dict.lookup(PDFName.of('Kids'));
    if (kids instanceof PDFArray) {
        for (var idx = 0, len = kids.size(); idx < len; idx++) {
            var kid = kids.lookup(idx);
            var kidIsField = kid instanceof PDFDict && kid.has(PDFName.of('T'));
            if (kidIsField)
                return true;
        }
    }
    return false;
};
var createPDFAcroTerminal = function (dict, ref) {
    var ftNameOrRef = getInheritableAttribute(dict, PDFName.of('FT'));
    var type = dict.context.lookup(ftNameOrRef, PDFName);
    if (type === PDFName.of('Btn'))
        return createPDFAcroButton(dict, ref);
    if (type === PDFName.of('Ch'))
        return createPDFAcroChoice(dict, ref);
    if (type === PDFName.of('Tx'))
        return PDFAcroText.fromDict(dict, ref);
    if (type === PDFName.of('Sig'))
        return PDFAcroSignature.fromDict(dict, ref);
    // We should never reach this line. But there are a lot of weird PDFs out
    // there. So, just to be safe, we'll try to handle things gracefully instead
    // of throwing an error.
    return PDFAcroTerminal.fromDict(dict, ref);
};
var createPDFAcroButton = function (dict, ref) {
    var _a;
    var ffNumberOrRef = getInheritableAttribute(dict, PDFName.of('Ff'));
    var ffNumber = dict.context.lookupMaybe(ffNumberOrRef, PDFNumber);
    var flags = (_a = ffNumber === null || ffNumber === void 0 ? void 0 : ffNumber.asNumber()) !== null && _a !== void 0 ? _a : 0;
    if (flagIsSet(flags, AcroButtonFlags.PushButton)) {
        return PDFAcroPushButton.fromDict(dict, ref);
    }
    else if (flagIsSet(flags, AcroButtonFlags.Radio)) {
        return PDFAcroRadioButton.fromDict(dict, ref);
    }
    else {
        return PDFAcroCheckBox.fromDict(dict, ref);
    }
};
var createPDFAcroChoice = function (dict, ref) {
    var _a;
    var ffNumberOrRef = getInheritableAttribute(dict, PDFName.of('Ff'));
    var ffNumber = dict.context.lookupMaybe(ffNumberOrRef, PDFNumber);
    var flags = (_a = ffNumber === null || ffNumber === void 0 ? void 0 : ffNumber.asNumber()) !== null && _a !== void 0 ? _a : 0;
    if (flagIsSet(flags, AcroChoiceFlags.Combo)) {
        return PDFAcroComboBox.fromDict(dict, ref);
    }
    else {
        return PDFAcroListBox.fromDict(dict, ref);
    }
};
var flagIsSet = function (flags, flag) {
    return (flags & flag) !== 0;
};
var getInheritableAttribute = function (startNode, name) {
    var attribute;
    ascend(startNode, function (node) {
        if (!attribute)
            attribute = node.get(name);
    });
    return attribute;
};
var ascend = function (startNode, visitor) {
    visitor(startNode);
    var Parent = startNode.lookupMaybe(PDFName.of('Parent'), PDFDict);
    if (Parent)
        ascend(Parent, visitor);
};
//# sourceMappingURL=utils.js.map