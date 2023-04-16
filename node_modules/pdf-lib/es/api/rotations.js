import { assertIs, error } from "../utils";
export var RotationTypes;
(function (RotationTypes) {
    RotationTypes["Degrees"] = "degrees";
    RotationTypes["Radians"] = "radians";
})(RotationTypes || (RotationTypes = {}));
export var radians = function (radianAngle) {
    assertIs(radianAngle, 'radianAngle', ['number']);
    return { type: RotationTypes.Radians, angle: radianAngle };
};
export var degrees = function (degreeAngle) {
    assertIs(degreeAngle, 'degreeAngle', ['number']);
    return { type: RotationTypes.Degrees, angle: degreeAngle };
};
var Radians = RotationTypes.Radians, Degrees = RotationTypes.Degrees;
export var degreesToRadians = function (degree) { return (degree * Math.PI) / 180; };
export var radiansToDegrees = function (radian) { return (radian * 180) / Math.PI; };
// prettier-ignore
export var toRadians = function (rotation) {
    return rotation.type === Radians ? rotation.angle
        : rotation.type === Degrees ? degreesToRadians(rotation.angle)
            : error("Invalid rotation: " + JSON.stringify(rotation));
};
// prettier-ignore
export var toDegrees = function (rotation) {
    return rotation.type === Radians ? radiansToDegrees(rotation.angle)
        : rotation.type === Degrees ? rotation.angle
            : error("Invalid rotation: " + JSON.stringify(rotation));
};
export var reduceRotation = function (degreeAngle) {
    if (degreeAngle === void 0) { degreeAngle = 0; }
    var quadrants = (degreeAngle / 90) % 4;
    if (quadrants === 0)
        return 0;
    if (quadrants === 1)
        return 90;
    if (quadrants === 2)
        return 180;
    if (quadrants === 3)
        return 270;
    return 0; // `degreeAngle` is not a multiple of 90
};
export var adjustDimsForRotation = function (dims, degreeAngle) {
    if (degreeAngle === void 0) { degreeAngle = 0; }
    var rotation = reduceRotation(degreeAngle);
    return rotation === 90 || rotation === 270
        ? { width: dims.height, height: dims.width }
        : { width: dims.width, height: dims.height };
};
export var rotateRectangle = function (rectangle, borderWidth, degreeAngle) {
    if (borderWidth === void 0) { borderWidth = 0; }
    if (degreeAngle === void 0) { degreeAngle = 0; }
    var x = rectangle.x, y = rectangle.y, w = rectangle.width, h = rectangle.height;
    var r = reduceRotation(degreeAngle);
    var b = borderWidth / 2;
    // prettier-ignore
    if (r === 0)
        return { x: x - b, y: y - b, width: w, height: h };
    else if (r === 90)
        return { x: x - h + b, y: y - b, width: h, height: w };
    else if (r === 180)
        return { x: x - w + b, y: y - h + b, width: w, height: h };
    else if (r === 270)
        return { x: x - b, y: y - w + b, width: h, height: w };
    else
        return { x: x - b, y: y - b, width: w, height: h };
};
//# sourceMappingURL=rotations.js.map