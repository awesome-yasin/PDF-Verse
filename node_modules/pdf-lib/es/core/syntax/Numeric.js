import CharCodes from "./CharCodes";
export var IsDigit = new Uint8Array(256);
IsDigit[CharCodes.Zero] = 1;
IsDigit[CharCodes.One] = 1;
IsDigit[CharCodes.Two] = 1;
IsDigit[CharCodes.Three] = 1;
IsDigit[CharCodes.Four] = 1;
IsDigit[CharCodes.Five] = 1;
IsDigit[CharCodes.Six] = 1;
IsDigit[CharCodes.Seven] = 1;
IsDigit[CharCodes.Eight] = 1;
IsDigit[CharCodes.Nine] = 1;
export var IsNumericPrefix = new Uint8Array(256);
IsNumericPrefix[CharCodes.Period] = 1;
IsNumericPrefix[CharCodes.Plus] = 1;
IsNumericPrefix[CharCodes.Minus] = 1;
export var IsNumeric = new Uint8Array(256);
for (var idx = 0, len = 256; idx < len; idx++) {
    IsNumeric[idx] = IsDigit[idx] || IsNumericPrefix[idx] ? 1 : 0;
}
//# sourceMappingURL=Numeric.js.map