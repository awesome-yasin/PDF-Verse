import { __spreadArrays } from "tslib";
import { setFillingColor, setStrokingColor } from "./colors";
import { beginText, closePath, drawObject, endText, fill, fillAndStroke, lineTo, moveTo, nextLine, popGraphicsState, pushGraphicsState, rotateAndSkewTextRadiansAndTranslate, rotateRadians, scale, setFontAndSize, setLineHeight, setLineWidth, showText, skewRadians, stroke, translate, setLineCap, rotateDegrees, setGraphicsState, setDashPattern, beginMarkedContent, endMarkedContent, clip, endPath, appendBezierCurve, } from "./operators";
import { degrees, toRadians } from "./rotations";
import { svgPathToOperators } from "./svgPath";
import { asNumber } from "./objects";
export var drawText = function (line, options) {
    return [
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        beginText(),
        setFillingColor(options.color),
        setFontAndSize(options.font, options.size),
        rotateAndSkewTextRadiansAndTranslate(toRadians(options.rotate), toRadians(options.xSkew), toRadians(options.ySkew), options.x, options.y),
        showText(line),
        endText(),
        popGraphicsState(),
    ].filter(Boolean);
};
export var drawLinesOfText = function (lines, options) {
    var operators = [
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        beginText(),
        setFillingColor(options.color),
        setFontAndSize(options.font, options.size),
        setLineHeight(options.lineHeight),
        rotateAndSkewTextRadiansAndTranslate(toRadians(options.rotate), toRadians(options.xSkew), toRadians(options.ySkew), options.x, options.y),
    ].filter(Boolean);
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        operators.push(showText(lines[idx]), nextLine());
    }
    operators.push(endText(), popGraphicsState());
    return operators;
};
export var drawImage = function (name, options) {
    return [
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        translate(options.x, options.y),
        rotateRadians(toRadians(options.rotate)),
        scale(options.width, options.height),
        skewRadians(toRadians(options.xSkew), toRadians(options.ySkew)),
        drawObject(name),
        popGraphicsState(),
    ].filter(Boolean);
};
export var drawPage = function (name, options) {
    return [
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        translate(options.x, options.y),
        rotateRadians(toRadians(options.rotate)),
        scale(options.xScale, options.yScale),
        skewRadians(toRadians(options.xSkew), toRadians(options.ySkew)),
        drawObject(name),
        popGraphicsState(),
    ].filter(Boolean);
};
export var drawLine = function (options) {
    var _a, _b;
    return [
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        options.color && setStrokingColor(options.color),
        setLineWidth(options.thickness),
        setDashPattern((_a = options.dashArray) !== null && _a !== void 0 ? _a : [], (_b = options.dashPhase) !== null && _b !== void 0 ? _b : 0),
        moveTo(options.start.x, options.start.y),
        options.lineCap && setLineCap(options.lineCap),
        moveTo(options.start.x, options.start.y),
        lineTo(options.end.x, options.end.y),
        stroke(),
        popGraphicsState(),
    ].filter(Boolean);
};
export var drawRectangle = function (options) {
    var _a, _b;
    return [
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        options.color && setFillingColor(options.color),
        options.borderColor && setStrokingColor(options.borderColor),
        setLineWidth(options.borderWidth),
        options.borderLineCap && setLineCap(options.borderLineCap),
        setDashPattern((_a = options.borderDashArray) !== null && _a !== void 0 ? _a : [], (_b = options.borderDashPhase) !== null && _b !== void 0 ? _b : 0),
        translate(options.x, options.y),
        rotateRadians(toRadians(options.rotate)),
        skewRadians(toRadians(options.xSkew), toRadians(options.ySkew)),
        moveTo(0, 0),
        lineTo(0, options.height),
        lineTo(options.width, options.height),
        lineTo(options.width, 0),
        closePath(),
        // prettier-ignore
        options.color && options.borderWidth ? fillAndStroke()
            : options.color ? fill()
                : options.borderColor ? stroke()
                    : closePath(),
        popGraphicsState(),
    ].filter(Boolean);
};
var KAPPA = 4.0 * ((Math.sqrt(2) - 1.0) / 3.0);
/** @deprecated */
export var drawEllipsePath = function (config) {
    var x = asNumber(config.x);
    var y = asNumber(config.y);
    var xScale = asNumber(config.xScale);
    var yScale = asNumber(config.yScale);
    x -= xScale;
    y -= yScale;
    var ox = xScale * KAPPA;
    var oy = yScale * KAPPA;
    var xe = x + xScale * 2;
    var ye = y + yScale * 2;
    var xm = x + xScale;
    var ym = y + yScale;
    return [
        pushGraphicsState(),
        moveTo(x, ym),
        appendBezierCurve(x, ym - oy, xm - ox, y, xm, y),
        appendBezierCurve(xm + ox, y, xe, ym - oy, xe, ym),
        appendBezierCurve(xe, ym + oy, xm + ox, ye, xm, ye),
        appendBezierCurve(xm - ox, ye, x, ym + oy, x, ym),
        popGraphicsState(),
    ];
};
var drawEllipseCurves = function (config) {
    var centerX = asNumber(config.x);
    var centerY = asNumber(config.y);
    var xScale = asNumber(config.xScale);
    var yScale = asNumber(config.yScale);
    var x = -xScale;
    var y = -yScale;
    var ox = xScale * KAPPA;
    var oy = yScale * KAPPA;
    var xe = x + xScale * 2;
    var ye = y + yScale * 2;
    var xm = x + xScale;
    var ym = y + yScale;
    return [
        translate(centerX, centerY),
        rotateRadians(toRadians(config.rotate)),
        moveTo(x, ym),
        appendBezierCurve(x, ym - oy, xm - ox, y, xm, y),
        appendBezierCurve(xm + ox, y, xe, ym - oy, xe, ym),
        appendBezierCurve(xe, ym + oy, xm + ox, ye, xm, ye),
        appendBezierCurve(xm - ox, ye, x, ym + oy, x, ym),
    ];
};
export var drawEllipse = function (options) {
    var _a, _b, _c;
    return __spreadArrays([
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        options.color && setFillingColor(options.color),
        options.borderColor && setStrokingColor(options.borderColor),
        setLineWidth(options.borderWidth),
        options.borderLineCap && setLineCap(options.borderLineCap),
        setDashPattern((_a = options.borderDashArray) !== null && _a !== void 0 ? _a : [], (_b = options.borderDashPhase) !== null && _b !== void 0 ? _b : 0)
    ], (options.rotate === undefined
        ? drawEllipsePath({
            x: options.x,
            y: options.y,
            xScale: options.xScale,
            yScale: options.yScale,
        })
        : drawEllipseCurves({
            x: options.x,
            y: options.y,
            xScale: options.xScale,
            yScale: options.yScale,
            rotate: (_c = options.rotate) !== null && _c !== void 0 ? _c : degrees(0),
        })), [
        // prettier-ignore
        options.color && options.borderWidth ? fillAndStroke()
            : options.color ? fill()
                : options.borderColor ? stroke()
                    : closePath(),
        popGraphicsState(),
    ]).filter(Boolean);
};
export var drawSvgPath = function (path, options) {
    var _a, _b, _c;
    return __spreadArrays([
        pushGraphicsState(),
        options.graphicsState && setGraphicsState(options.graphicsState),
        translate(options.x, options.y),
        rotateRadians(toRadians((_a = options.rotate) !== null && _a !== void 0 ? _a : degrees(0))),
        // SVG path Y axis is opposite pdf-lib's
        options.scale ? scale(options.scale, -options.scale) : scale(1, -1),
        options.color && setFillingColor(options.color),
        options.borderColor && setStrokingColor(options.borderColor),
        options.borderWidth && setLineWidth(options.borderWidth),
        options.borderLineCap && setLineCap(options.borderLineCap),
        setDashPattern((_b = options.borderDashArray) !== null && _b !== void 0 ? _b : [], (_c = options.borderDashPhase) !== null && _c !== void 0 ? _c : 0)
    ], svgPathToOperators(path), [
        // prettier-ignore
        options.color && options.borderWidth ? fillAndStroke()
            : options.color ? fill()
                : options.borderColor ? stroke()
                    : closePath(),
        popGraphicsState(),
    ]).filter(Boolean);
};
export var drawCheckMark = function (options) {
    var size = asNumber(options.size);
    /*********************** Define Check Mark Points ***************************/
    // A check mark is defined by three points in some coordinate space. Here, we
    // define these points in a unit coordinate system, where the range of the x
    // and y axis are both [-1, 1].
    //
    // Note that we do not hard code `p1y` in case we wish to change the
    // size/shape of the check mark in the future. We want the check mark to
    // always form a right angle. This means that the dot product between (p1-p2)
    // and (p3-p2) should be zero:
    //
    //   (p1x-p2x) * (p3x-p2x) + (p1y-p2y) * (p3y-p2y) = 0
    //
    // We can now rejigger this equation to solve for `p1y`:
    //
    //   (p1y-p2y) * (p3y-p2y) = -((p1x-p2x) * (p3x-p2x))
    //   (p1y-p2y) = -((p1x-p2x) * (p3x-p2x)) / (p3y-p2y)
    //   p1y = -((p1x-p2x) * (p3x-p2x)) / (p3y-p2y) + p2y
    //
    // Thanks to my friend Joel Walker (https://github.com/JWalker1995) for
    // devising the above equation and unit coordinate system approach!
    // (x, y) coords of the check mark's bottommost point
    var p2x = -1 + 0.75;
    var p2y = -1 + 0.51;
    // (x, y) coords of the check mark's topmost point
    var p3y = 1 - 0.525;
    var p3x = 1 - 0.31;
    // (x, y) coords of the check mark's center (vertically) point
    var p1x = -1 + 0.325;
    var p1y = -((p1x - p2x) * (p3x - p2x)) / (p3y - p2y) + p2y;
    /****************************************************************************/
    return [
        pushGraphicsState(),
        options.color && setStrokingColor(options.color),
        setLineWidth(options.thickness),
        translate(options.x, options.y),
        moveTo(p1x * size, p1y * size),
        lineTo(p2x * size, p2y * size),
        lineTo(p3x * size, p3y * size),
        stroke(),
        popGraphicsState(),
    ].filter(Boolean);
};
// prettier-ignore
export var rotateInPlace = function (options) {
    return options.rotation === 0 ? [
        translate(0, 0),
        rotateDegrees(0)
    ]
        : options.rotation === 90 ? [
            translate(options.width, 0),
            rotateDegrees(90)
        ]
            : options.rotation === 180 ? [
                translate(options.width, options.height),
                rotateDegrees(180)
            ]
                : options.rotation === 270 ? [
                    translate(0, options.height),
                    rotateDegrees(270)
                ]
                    : [];
}; // Invalid rotation - noop
export var drawCheckBox = function (options) {
    var outline = drawRectangle({
        x: options.x,
        y: options.y,
        width: options.width,
        height: options.height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    if (!options.filled)
        return outline;
    var width = asNumber(options.width);
    var height = asNumber(options.height);
    var checkMarkSize = Math.min(width, height) / 2;
    var checkMark = drawCheckMark({
        x: width / 2,
        y: height / 2,
        size: checkMarkSize,
        thickness: options.thickness,
        color: options.markColor,
    });
    return __spreadArrays([pushGraphicsState()], outline, checkMark, [popGraphicsState()]);
};
export var drawRadioButton = function (options) {
    var width = asNumber(options.width);
    var height = asNumber(options.height);
    var outlineScale = Math.min(width, height) / 2;
    var outline = drawEllipse({
        x: options.x,
        y: options.y,
        xScale: outlineScale,
        yScale: outlineScale,
        color: options.color,
        borderColor: options.borderColor,
        borderWidth: options.borderWidth,
    });
    if (!options.filled)
        return outline;
    var dot = drawEllipse({
        x: options.x,
        y: options.y,
        xScale: outlineScale * 0.45,
        yScale: outlineScale * 0.45,
        color: options.dotColor,
        borderColor: undefined,
        borderWidth: 0,
    });
    return __spreadArrays([pushGraphicsState()], outline, dot, [popGraphicsState()]);
};
export var drawButton = function (options) {
    var x = asNumber(options.x);
    var y = asNumber(options.y);
    var width = asNumber(options.width);
    var height = asNumber(options.height);
    var background = drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    var lines = drawTextLines(options.textLines, {
        color: options.textColor,
        font: options.font,
        size: options.fontSize,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    return __spreadArrays([pushGraphicsState()], background, lines, [popGraphicsState()]);
};
export var drawTextLines = function (lines, options) {
    var operators = [
        beginText(),
        setFillingColor(options.color),
        setFontAndSize(options.font, options.size),
    ];
    for (var idx = 0, len = lines.length; idx < len; idx++) {
        var _a = lines[idx], encoded = _a.encoded, x = _a.x, y = _a.y;
        operators.push(rotateAndSkewTextRadiansAndTranslate(toRadians(options.rotate), toRadians(options.xSkew), toRadians(options.ySkew), x, y), showText(encoded));
    }
    operators.push(endText());
    return operators;
};
export var drawTextField = function (options) {
    var x = asNumber(options.x);
    var y = asNumber(options.y);
    var width = asNumber(options.width);
    var height = asNumber(options.height);
    var borderWidth = asNumber(options.borderWidth);
    var padding = asNumber(options.padding);
    var clipX = x + borderWidth / 2 + padding;
    var clipY = y + borderWidth / 2 + padding;
    var clipWidth = width - (borderWidth / 2 + padding) * 2;
    var clipHeight = height - (borderWidth / 2 + padding) * 2;
    var clippingArea = [
        moveTo(clipX, clipY),
        lineTo(clipX, clipY + clipHeight),
        lineTo(clipX + clipWidth, clipY + clipHeight),
        lineTo(clipX + clipWidth, clipY),
        closePath(),
        clip(),
        endPath(),
    ];
    var background = drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    var lines = drawTextLines(options.textLines, {
        color: options.textColor,
        font: options.font,
        size: options.fontSize,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    var markedContent = __spreadArrays([
        beginMarkedContent('Tx'),
        pushGraphicsState()
    ], lines, [
        popGraphicsState(),
        endMarkedContent(),
    ]);
    return __spreadArrays([
        pushGraphicsState()
    ], background, clippingArea, markedContent, [
        popGraphicsState(),
    ]);
};
export var drawOptionList = function (options) {
    var x = asNumber(options.x);
    var y = asNumber(options.y);
    var width = asNumber(options.width);
    var height = asNumber(options.height);
    var lineHeight = asNumber(options.lineHeight);
    var borderWidth = asNumber(options.borderWidth);
    var padding = asNumber(options.padding);
    var clipX = x + borderWidth / 2 + padding;
    var clipY = y + borderWidth / 2 + padding;
    var clipWidth = width - (borderWidth / 2 + padding) * 2;
    var clipHeight = height - (borderWidth / 2 + padding) * 2;
    var clippingArea = [
        moveTo(clipX, clipY),
        lineTo(clipX, clipY + clipHeight),
        lineTo(clipX + clipWidth, clipY + clipHeight),
        lineTo(clipX + clipWidth, clipY),
        closePath(),
        clip(),
        endPath(),
    ];
    var background = drawRectangle({
        x: x,
        y: y,
        width: width,
        height: height,
        borderWidth: options.borderWidth,
        color: options.color,
        borderColor: options.borderColor,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    var highlights = [];
    for (var idx = 0, len = options.selectedLines.length; idx < len; idx++) {
        var line = options.textLines[options.selectedLines[idx]];
        highlights.push.apply(highlights, drawRectangle({
            x: line.x - padding,
            y: line.y - (lineHeight - line.height) / 2,
            width: width - borderWidth,
            height: line.height + (lineHeight - line.height) / 2,
            borderWidth: 0,
            color: options.selectedColor,
            borderColor: undefined,
            rotate: degrees(0),
            xSkew: degrees(0),
            ySkew: degrees(0),
        }));
    }
    var lines = drawTextLines(options.textLines, {
        color: options.textColor,
        font: options.font,
        size: options.fontSize,
        rotate: degrees(0),
        xSkew: degrees(0),
        ySkew: degrees(0),
    });
    var markedContent = __spreadArrays([
        beginMarkedContent('Tx'),
        pushGraphicsState()
    ], lines, [
        popGraphicsState(),
        endMarkedContent(),
    ]);
    return __spreadArrays([
        pushGraphicsState()
    ], background, highlights, clippingArea, markedContent, [
        popGraphicsState(),
    ]);
};
//# sourceMappingURL=operations.js.map