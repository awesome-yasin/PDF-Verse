import { PDFName, PDFNumber } from "../core";
export var asPDFName = function (name) {
    return name instanceof PDFName ? name : PDFName.of(name);
};
export var asPDFNumber = function (num) {
    return num instanceof PDFNumber ? num : PDFNumber.of(num);
};
export var asNumber = function (num) {
    return num instanceof PDFNumber ? num.asNumber() : num;
};
//# sourceMappingURL=objects.js.map