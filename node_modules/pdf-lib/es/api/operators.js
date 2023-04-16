import { asNumber, asPDFName, asPDFNumber } from "./objects";
import { degreesToRadians } from "./rotations";
import { PDFOperator, PDFOperatorNames as Ops, } from "../core";
/* ==================== Clipping Path Operators ==================== */
export var clip = function () { return PDFOperator.of(Ops.ClipNonZero); };
export var clipEvenOdd = function () { return PDFOperator.of(Ops.ClipEvenOdd); };
/* ==================== Graphics State Operators ==================== */
var cos = Math.cos, sin = Math.sin, tan = Math.tan;
export var concatTransformationMatrix = function (a, b, c, d, e, f) {
    return PDFOperator.of(Ops.ConcatTransformationMatrix, [
        asPDFNumber(a),
        asPDFNumber(b),
        asPDFNumber(c),
        asPDFNumber(d),
        asPDFNumber(e),
        asPDFNumber(f),
    ]);
};
export var translate = function (xPos, yPos) {
    return concatTransformationMatrix(1, 0, 0, 1, xPos, yPos);
};
export var scale = function (xPos, yPos) {
    return concatTransformationMatrix(xPos, 0, 0, yPos, 0, 0);
};
export var rotateRadians = function (angle) {
    return concatTransformationMatrix(cos(asNumber(angle)), sin(asNumber(angle)), -sin(asNumber(angle)), cos(asNumber(angle)), 0, 0);
};
export var rotateDegrees = function (angle) {
    return rotateRadians(degreesToRadians(asNumber(angle)));
};
export var skewRadians = function (xSkewAngle, ySkewAngle) {
    return concatTransformationMatrix(1, tan(asNumber(xSkewAngle)), tan(asNumber(ySkewAngle)), 1, 0, 0);
};
export var skewDegrees = function (xSkewAngle, ySkewAngle) {
    return skewRadians(degreesToRadians(asNumber(xSkewAngle)), degreesToRadians(asNumber(ySkewAngle)));
};
export var setDashPattern = function (dashArray, dashPhase) {
    return PDFOperator.of(Ops.SetLineDashPattern, [
        "[" + dashArray.map(asPDFNumber).join(' ') + "]",
        asPDFNumber(dashPhase),
    ]);
};
export var restoreDashPattern = function () { return setDashPattern([], 0); };
export var LineCapStyle;
(function (LineCapStyle) {
    LineCapStyle[LineCapStyle["Butt"] = 0] = "Butt";
    LineCapStyle[LineCapStyle["Round"] = 1] = "Round";
    LineCapStyle[LineCapStyle["Projecting"] = 2] = "Projecting";
})(LineCapStyle || (LineCapStyle = {}));
export var setLineCap = function (style) {
    return PDFOperator.of(Ops.SetLineCapStyle, [asPDFNumber(style)]);
};
export var LineJoinStyle;
(function (LineJoinStyle) {
    LineJoinStyle[LineJoinStyle["Miter"] = 0] = "Miter";
    LineJoinStyle[LineJoinStyle["Round"] = 1] = "Round";
    LineJoinStyle[LineJoinStyle["Bevel"] = 2] = "Bevel";
})(LineJoinStyle || (LineJoinStyle = {}));
export var setLineJoin = function (style) {
    return PDFOperator.of(Ops.SetLineJoinStyle, [asPDFNumber(style)]);
};
export var setGraphicsState = function (state) {
    return PDFOperator.of(Ops.SetGraphicsStateParams, [asPDFName(state)]);
};
export var pushGraphicsState = function () { return PDFOperator.of(Ops.PushGraphicsState); };
export var popGraphicsState = function () { return PDFOperator.of(Ops.PopGraphicsState); };
export var setLineWidth = function (width) {
    return PDFOperator.of(Ops.SetLineWidth, [asPDFNumber(width)]);
};
/* ==================== Path Construction Operators ==================== */
export var appendBezierCurve = function (x1, y1, x2, y2, x3, y3) {
    return PDFOperator.of(Ops.AppendBezierCurve, [
        asPDFNumber(x1),
        asPDFNumber(y1),
        asPDFNumber(x2),
        asPDFNumber(y2),
        asPDFNumber(x3),
        asPDFNumber(y3),
    ]);
};
export var appendQuadraticCurve = function (x1, y1, x2, y2) {
    return PDFOperator.of(Ops.CurveToReplicateInitialPoint, [
        asPDFNumber(x1),
        asPDFNumber(y1),
        asPDFNumber(x2),
        asPDFNumber(y2),
    ]);
};
export var closePath = function () { return PDFOperator.of(Ops.ClosePath); };
export var moveTo = function (xPos, yPos) {
    return PDFOperator.of(Ops.MoveTo, [asPDFNumber(xPos), asPDFNumber(yPos)]);
};
export var lineTo = function (xPos, yPos) {
    return PDFOperator.of(Ops.LineTo, [asPDFNumber(xPos), asPDFNumber(yPos)]);
};
/**
 * @param xPos x coordinate for the lower left corner of the rectangle
 * @param yPos y coordinate for the lower left corner of the rectangle
 * @param width width of the rectangle
 * @param height height of the rectangle
 */
export var rectangle = function (xPos, yPos, width, height) {
    return PDFOperator.of(Ops.AppendRectangle, [
        asPDFNumber(xPos),
        asPDFNumber(yPos),
        asPDFNumber(width),
        asPDFNumber(height),
    ]);
};
/**
 * @param xPos x coordinate for the lower left corner of the square
 * @param yPos y coordinate for the lower left corner of the square
 * @param size width and height of the square
 */
export var square = function (xPos, yPos, size) {
    return rectangle(xPos, yPos, size, size);
};
/* ==================== Path Painting Operators ==================== */
export var stroke = function () { return PDFOperator.of(Ops.StrokePath); };
export var fill = function () { return PDFOperator.of(Ops.FillNonZero); };
export var fillAndStroke = function () { return PDFOperator.of(Ops.FillNonZeroAndStroke); };
export var endPath = function () { return PDFOperator.of(Ops.EndPath); };
/* ==================== Text Positioning Operators ==================== */
export var nextLine = function () { return PDFOperator.of(Ops.NextLine); };
export var moveText = function (x, y) {
    return PDFOperator.of(Ops.MoveText, [asPDFNumber(x), asPDFNumber(y)]);
};
/* ==================== Text Showing Operators ==================== */
export var showText = function (text) {
    return PDFOperator.of(Ops.ShowText, [text]);
};
/* ==================== Text State Operators ==================== */
export var beginText = function () { return PDFOperator.of(Ops.BeginText); };
export var endText = function () { return PDFOperator.of(Ops.EndText); };
export var setFontAndSize = function (name, size) { return PDFOperator.of(Ops.SetFontAndSize, [asPDFName(name), asPDFNumber(size)]); };
export var setCharacterSpacing = function (spacing) {
    return PDFOperator.of(Ops.SetCharacterSpacing, [asPDFNumber(spacing)]);
};
export var setWordSpacing = function (spacing) {
    return PDFOperator.of(Ops.SetWordSpacing, [asPDFNumber(spacing)]);
};
/** @param squeeze horizontal character spacing */
export var setCharacterSqueeze = function (squeeze) {
    return PDFOperator.of(Ops.SetTextHorizontalScaling, [asPDFNumber(squeeze)]);
};
export var setLineHeight = function (lineHeight) {
    return PDFOperator.of(Ops.SetTextLineHeight, [asPDFNumber(lineHeight)]);
};
export var setTextRise = function (rise) {
    return PDFOperator.of(Ops.SetTextRise, [asPDFNumber(rise)]);
};
export var TextRenderingMode;
(function (TextRenderingMode) {
    TextRenderingMode[TextRenderingMode["Fill"] = 0] = "Fill";
    TextRenderingMode[TextRenderingMode["Outline"] = 1] = "Outline";
    TextRenderingMode[TextRenderingMode["FillAndOutline"] = 2] = "FillAndOutline";
    TextRenderingMode[TextRenderingMode["Invisible"] = 3] = "Invisible";
    TextRenderingMode[TextRenderingMode["FillAndClip"] = 4] = "FillAndClip";
    TextRenderingMode[TextRenderingMode["OutlineAndClip"] = 5] = "OutlineAndClip";
    TextRenderingMode[TextRenderingMode["FillAndOutlineAndClip"] = 6] = "FillAndOutlineAndClip";
    TextRenderingMode[TextRenderingMode["Clip"] = 7] = "Clip";
})(TextRenderingMode || (TextRenderingMode = {}));
export var setTextRenderingMode = function (mode) {
    return PDFOperator.of(Ops.SetTextRenderingMode, [asPDFNumber(mode)]);
};
export var setTextMatrix = function (a, b, c, d, e, f) {
    return PDFOperator.of(Ops.SetTextMatrix, [
        asPDFNumber(a),
        asPDFNumber(b),
        asPDFNumber(c),
        asPDFNumber(d),
        asPDFNumber(e),
        asPDFNumber(f),
    ]);
};
export var rotateAndSkewTextRadiansAndTranslate = function (rotationAngle, xSkewAngle, ySkewAngle, x, y) {
    return setTextMatrix(cos(asNumber(rotationAngle)), sin(asNumber(rotationAngle)) + tan(asNumber(xSkewAngle)), -sin(asNumber(rotationAngle)) + tan(asNumber(ySkewAngle)), cos(asNumber(rotationAngle)), x, y);
};
export var rotateAndSkewTextDegreesAndTranslate = function (rotationAngle, xSkewAngle, ySkewAngle, x, y) {
    return rotateAndSkewTextRadiansAndTranslate(degreesToRadians(asNumber(rotationAngle)), degreesToRadians(asNumber(xSkewAngle)), degreesToRadians(asNumber(ySkewAngle)), x, y);
};
/* ==================== XObject Operator ==================== */
export var drawObject = function (name) {
    return PDFOperator.of(Ops.DrawObject, [asPDFName(name)]);
};
/* ==================== Color Operators ==================== */
export var setFillingGrayscaleColor = function (gray) {
    return PDFOperator.of(Ops.NonStrokingColorGray, [asPDFNumber(gray)]);
};
export var setStrokingGrayscaleColor = function (gray) {
    return PDFOperator.of(Ops.StrokingColorGray, [asPDFNumber(gray)]);
};
export var setFillingRgbColor = function (red, green, blue) {
    return PDFOperator.of(Ops.NonStrokingColorRgb, [
        asPDFNumber(red),
        asPDFNumber(green),
        asPDFNumber(blue),
    ]);
};
export var setStrokingRgbColor = function (red, green, blue) {
    return PDFOperator.of(Ops.StrokingColorRgb, [
        asPDFNumber(red),
        asPDFNumber(green),
        asPDFNumber(blue),
    ]);
};
export var setFillingCmykColor = function (cyan, magenta, yellow, key) {
    return PDFOperator.of(Ops.NonStrokingColorCmyk, [
        asPDFNumber(cyan),
        asPDFNumber(magenta),
        asPDFNumber(yellow),
        asPDFNumber(key),
    ]);
};
export var setStrokingCmykColor = function (cyan, magenta, yellow, key) {
    return PDFOperator.of(Ops.StrokingColorCmyk, [
        asPDFNumber(cyan),
        asPDFNumber(magenta),
        asPDFNumber(yellow),
        asPDFNumber(key),
    ]);
};
/* ==================== Marked Content Operators ==================== */
export var beginMarkedContent = function (tag) {
    return PDFOperator.of(Ops.BeginMarkedContent, [asPDFName(tag)]);
};
export var endMarkedContent = function () { return PDFOperator.of(Ops.EndMarkedContent); };
//# sourceMappingURL=operators.js.map