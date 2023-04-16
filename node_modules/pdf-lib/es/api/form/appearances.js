import { __assign, __spreadArrays } from "tslib";
import { drawCheckBox, rotateInPlace, drawRadioButton, drawButton, drawTextField, drawOptionList, } from "../operations";
import { rgb, componentsToColor, setFillingColor, grayscale, cmyk, } from "../colors";
import { reduceRotation, adjustDimsForRotation } from "../rotations";
import { layoutMultilineText, layoutCombedText, layoutSinglelineText, } from "../text/layout";
import { TextAlignment } from "../text/alignment";
import { setFontAndSize } from "../operators";
import { findLastMatch } from "../../utils";
/********************* Appearance Provider Functions **************************/
export var normalizeAppearance = function (appearance) {
    if ('normal' in appearance)
        return appearance;
    return { normal: appearance };
};
// Examples:
//   `/Helv 12 Tf` -> ['/Helv 12 Tf', 'Helv', '12']
//   `/HeBo 8.00 Tf` -> ['/HeBo 8 Tf', 'HeBo', '8.00']
var tfRegex = /\/([^\0\t\n\f\r\ ]+)[\0\t\n\f\r\ ]+(\d*\.\d+|\d+)[\0\t\n\f\r\ ]+Tf/;
var getDefaultFontSize = function (field) {
    var _a, _b;
    var da = (_a = field.getDefaultAppearance()) !== null && _a !== void 0 ? _a : '';
    var daMatch = (_b = findLastMatch(da, tfRegex).match) !== null && _b !== void 0 ? _b : [];
    var defaultFontSize = Number(daMatch[2]);
    return isFinite(defaultFontSize) ? defaultFontSize : undefined;
};
// Examples:
//   `0.3 g` -> ['0.3', 'g']
//   `0.3 1 .3 rg` -> ['0.3', '1', '.3', 'rg']
//   `0.3 1 .3 0 k` -> ['0.3', '1', '.3', '0', 'k']
var colorRegex = /(\d*\.\d+|\d+)[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]*(\d*\.\d+|\d+)?[\0\t\n\f\r\ ]+(g|rg|k)/;
var getDefaultColor = function (field) {
    var _a;
    var da = (_a = field.getDefaultAppearance()) !== null && _a !== void 0 ? _a : '';
    var daMatch = findLastMatch(da, colorRegex).match;
    var _b = daMatch !== null && daMatch !== void 0 ? daMatch : [], c1 = _b[1], c2 = _b[2], c3 = _b[3], c4 = _b[4], colorSpace = _b[5];
    if (colorSpace === 'g' && c1) {
        return grayscale(Number(c1));
    }
    if (colorSpace === 'rg' && c1 && c2 && c3) {
        return rgb(Number(c1), Number(c2), Number(c3));
    }
    if (colorSpace === 'k' && c1 && c2 && c3 && c4) {
        return cmyk(Number(c1), Number(c2), Number(c3), Number(c4));
    }
    return undefined;
};
var updateDefaultAppearance = function (field, color, font, fontSize) {
    var _a;
    if (fontSize === void 0) { fontSize = 0; }
    var da = [
        setFillingColor(color).toString(),
        setFontAndSize((_a = font === null || font === void 0 ? void 0 : font.name) !== null && _a !== void 0 ? _a : 'dummy__noop', fontSize).toString(),
    ].join('\n');
    field.setDefaultAppearance(da);
};
export var defaultCheckBoxAppearanceProvider = function (checkBox, widget) {
    var _a, _b, _c;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(checkBox.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
    var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _d = adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
    var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
    var black = rgb(0, 0, 0);
    var borderColor = (_b = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor())) !== null && _b !== void 0 ? _b : black;
    var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var downBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
    // Update color
    var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
    if (widgetColor) {
        updateDefaultAppearance(widget, textColor);
    }
    else {
        updateDefaultAppearance(checkBox.acroField, textColor);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        thickness: 1.5,
        borderWidth: borderWidth,
        borderColor: borderColor,
        markColor: textColor,
    };
    return {
        normal: {
            on: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: normalBackgroundColor, filled: true }))),
            off: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: normalBackgroundColor, filled: false }))),
        },
        down: {
            on: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: downBackgroundColor, filled: true }))),
            off: __spreadArrays(rotate, drawCheckBox(__assign(__assign({}, options), { color: downBackgroundColor, filled: false }))),
        },
    };
};
export var defaultRadioGroupAppearanceProvider = function (radioGroup, widget) {
    var _a, _b, _c;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(radioGroup.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
    var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _d = adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
    var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
    var black = rgb(0, 0, 0);
    var borderColor = (_b = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor())) !== null && _b !== void 0 ? _b : black;
    var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var downBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
    // Update color
    var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
    if (widgetColor) {
        updateDefaultAppearance(widget, textColor);
    }
    else {
        updateDefaultAppearance(radioGroup.acroField, textColor);
    }
    var options = {
        x: width / 2,
        y: height / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth,
        borderColor: borderColor,
        dotColor: textColor,
    };
    return {
        normal: {
            on: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: normalBackgroundColor, filled: true }))),
            off: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: normalBackgroundColor, filled: false }))),
        },
        down: {
            on: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: downBackgroundColor, filled: true }))),
            off: __spreadArrays(rotate, drawRadioButton(__assign(__assign({}, options), { color: downBackgroundColor, filled: false }))),
        },
    };
};
export var defaultButtonAppearanceProvider = function (button, widget, font) {
    var _a, _b, _c, _d, _e;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(button.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(button.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var captions = ap === null || ap === void 0 ? void 0 : ap.getCaptions();
    var normalText = (_a = captions === null || captions === void 0 ? void 0 : captions.normal) !== null && _a !== void 0 ? _a : '';
    var downText = (_c = (_b = captions === null || captions === void 0 ? void 0 : captions.down) !== null && _b !== void 0 ? _b : normalText) !== null && _c !== void 0 ? _c : '';
    var borderWidth = (_d = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _d !== void 0 ? _d : 0;
    var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _f = adjustDimsForRotation(rectangle, rotation), width = _f.width, height = _f.height;
    var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
    var black = rgb(0, 0, 0);
    var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var downBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor(), 0.8);
    var bounds = {
        x: borderWidth,
        y: borderWidth,
        width: width - borderWidth * 2,
        height: height - borderWidth * 2,
    };
    var normalLayout = layoutSinglelineText(normalText, {
        alignment: TextAlignment.Center,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    });
    var downLayout = layoutSinglelineText(downText, {
        alignment: TextAlignment.Center,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    });
    // Update font size and color
    var fontSize = Math.min(normalLayout.fontSize, downLayout.fontSize);
    var textColor = (_e = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _e !== void 0 ? _e : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(button.acroField, textColor, font, fontSize);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
    };
    return {
        normal: __spreadArrays(rotate, drawButton(__assign(__assign({}, options), { color: normalBackgroundColor, textLines: [normalLayout.line] }))),
        down: __spreadArrays(rotate, drawButton(__assign(__assign({}, options), { color: downBackgroundColor, textLines: [downLayout.line] }))),
    };
};
export var defaultTextFieldAppearanceProvider = function (textField, widget, font) {
    var _a, _b, _c, _d;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(textField.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(textField.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var text = (_a = textField.getText()) !== null && _a !== void 0 ? _a : '';
    var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
    var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _e = adjustDimsForRotation(rectangle, rotation), width = _e.width, height = _e.height;
    var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
    var black = rgb(0, 0, 0);
    var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var textLines;
    var fontSize;
    var padding = textField.isCombed() ? 0 : 1;
    var bounds = {
        x: borderWidth + padding,
        y: borderWidth + padding,
        width: width - (borderWidth + padding) * 2,
        height: height - (borderWidth + padding) * 2,
    };
    if (textField.isMultiline()) {
        var layout = layoutMultilineText(text, {
            alignment: textField.getAlignment(),
            fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
            font: font,
            bounds: bounds,
        });
        textLines = layout.lines;
        fontSize = layout.fontSize;
    }
    else if (textField.isCombed()) {
        var layout = layoutCombedText(text, {
            fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
            font: font,
            bounds: bounds,
            cellCount: (_c = textField.getMaxLength()) !== null && _c !== void 0 ? _c : 0,
        });
        textLines = layout.cells;
        fontSize = layout.fontSize;
    }
    else {
        var layout = layoutSinglelineText(text, {
            alignment: textField.getAlignment(),
            fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
            font: font,
            bounds: bounds,
        });
        textLines = [layout.line];
        fontSize = layout.fontSize;
    }
    // Update font size and color
    var textColor = (_d = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _d !== void 0 ? _d : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(textField.acroField, textColor, font, fontSize);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
        color: normalBackgroundColor,
        textLines: textLines,
        padding: padding,
    };
    return __spreadArrays(rotate, drawTextField(options));
};
export var defaultDropdownAppearanceProvider = function (dropdown, widget, font) {
    var _a, _b, _c;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(dropdown.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(dropdown.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var text = (_a = dropdown.getSelected()[0]) !== null && _a !== void 0 ? _a : '';
    var borderWidth = (_b = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _b !== void 0 ? _b : 0;
    var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _d = adjustDimsForRotation(rectangle, rotation), width = _d.width, height = _d.height;
    var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
    var black = rgb(0, 0, 0);
    var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var padding = 1;
    var bounds = {
        x: borderWidth + padding,
        y: borderWidth + padding,
        width: width - (borderWidth + padding) * 2,
        height: height - (borderWidth + padding) * 2,
    };
    var _e = layoutSinglelineText(text, {
        alignment: TextAlignment.Left,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    }), line = _e.line, fontSize = _e.fontSize;
    // Update font size and color
    var textColor = (_c = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _c !== void 0 ? _c : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(dropdown.acroField, textColor, font, fontSize);
    }
    var options = {
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
        color: normalBackgroundColor,
        textLines: [line],
        padding: padding,
    };
    return __spreadArrays(rotate, drawTextField(options));
};
export var defaultOptionListAppearanceProvider = function (optionList, widget, font) {
    var _a, _b;
    // The `/DA` entry can be at the widget or field level - so we handle both
    var widgetColor = getDefaultColor(widget);
    var fieldColor = getDefaultColor(optionList.acroField);
    var widgetFontSize = getDefaultFontSize(widget);
    var fieldFontSize = getDefaultFontSize(optionList.acroField);
    var rectangle = widget.getRectangle();
    var ap = widget.getAppearanceCharacteristics();
    var bs = widget.getBorderStyle();
    var borderWidth = (_a = bs === null || bs === void 0 ? void 0 : bs.getWidth()) !== null && _a !== void 0 ? _a : 0;
    var rotation = reduceRotation(ap === null || ap === void 0 ? void 0 : ap.getRotation());
    var _c = adjustDimsForRotation(rectangle, rotation), width = _c.width, height = _c.height;
    var rotate = rotateInPlace(__assign(__assign({}, rectangle), { rotation: rotation }));
    var black = rgb(0, 0, 0);
    var borderColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBorderColor());
    var normalBackgroundColor = componentsToColor(ap === null || ap === void 0 ? void 0 : ap.getBackgroundColor());
    var options = optionList.getOptions();
    var selected = optionList.getSelected();
    if (optionList.isSorted())
        options.sort();
    var text = '';
    for (var idx = 0, len = options.length; idx < len; idx++) {
        text += options[idx];
        if (idx < len - 1)
            text += '\n';
    }
    var padding = 1;
    var bounds = {
        x: borderWidth + padding,
        y: borderWidth + padding,
        width: width - (borderWidth + padding) * 2,
        height: height - (borderWidth + padding) * 2,
    };
    var _d = layoutMultilineText(text, {
        alignment: TextAlignment.Left,
        fontSize: widgetFontSize !== null && widgetFontSize !== void 0 ? widgetFontSize : fieldFontSize,
        font: font,
        bounds: bounds,
    }), lines = _d.lines, fontSize = _d.fontSize, lineHeight = _d.lineHeight;
    var selectedLines = [];
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        var line = lines[idx];
        if (selected.includes(line.text))
            selectedLines.push(idx);
    }
    var blue = rgb(153 / 255, 193 / 255, 218 / 255);
    // Update font size and color
    var textColor = (_b = widgetColor !== null && widgetColor !== void 0 ? widgetColor : fieldColor) !== null && _b !== void 0 ? _b : black;
    if (widgetColor || widgetFontSize !== undefined) {
        updateDefaultAppearance(widget, textColor, font, fontSize);
    }
    else {
        updateDefaultAppearance(optionList.acroField, textColor, font, fontSize);
    }
    return __spreadArrays(rotate, drawOptionList({
        x: 0 + borderWidth / 2,
        y: 0 + borderWidth / 2,
        width: width - borderWidth,
        height: height - borderWidth,
        borderWidth: borderWidth !== null && borderWidth !== void 0 ? borderWidth : 0,
        borderColor: borderColor,
        textColor: textColor,
        font: font.name,
        fontSize: fontSize,
        color: normalBackgroundColor,
        textLines: lines,
        lineHeight: lineHeight,
        selectedColor: blue,
        selectedLines: selectedLines,
        padding: padding,
    }));
};
//# sourceMappingURL=appearances.js.map