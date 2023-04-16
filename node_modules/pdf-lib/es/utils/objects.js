import { FontNames } from '@pdf-lib/standard-fonts';
export var values = function (obj) { return Object.keys(obj).map(function (k) { return obj[k]; }); };
export var StandardFontValues = values(FontNames);
export var isStandardFont = function (input) {
    return StandardFontValues.includes(input);
};
export var rectanglesAreEqual = function (a, b) { return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height; };
//# sourceMappingURL=objects.js.map