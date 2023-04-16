import UPNG from '@pdf-lib/upng';
var getImageType = function (ctype) {
    if (ctype === 0)
        return PngType.Greyscale;
    if (ctype === 2)
        return PngType.Truecolour;
    if (ctype === 3)
        return PngType.IndexedColour;
    if (ctype === 4)
        return PngType.GreyscaleWithAlpha;
    if (ctype === 6)
        return PngType.TruecolourWithAlpha;
    throw new Error("Unknown color type: " + ctype);
};
var splitAlphaChannel = function (rgbaChannel) {
    var pixelCount = Math.floor(rgbaChannel.length / 4);
    var rgbChannel = new Uint8Array(pixelCount * 3);
    var alphaChannel = new Uint8Array(pixelCount * 1);
    var rgbaOffset = 0;
    var rgbOffset = 0;
    var alphaOffset = 0;
    while (rgbaOffset < rgbaChannel.length) {
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        rgbChannel[rgbOffset++] = rgbaChannel[rgbaOffset++];
        alphaChannel[alphaOffset++] = rgbaChannel[rgbaOffset++];
    }
    return { rgbChannel: rgbChannel, alphaChannel: alphaChannel };
};
export var PngType;
(function (PngType) {
    PngType["Greyscale"] = "Greyscale";
    PngType["Truecolour"] = "Truecolour";
    PngType["IndexedColour"] = "IndexedColour";
    PngType["GreyscaleWithAlpha"] = "GreyscaleWithAlpha";
    PngType["TruecolourWithAlpha"] = "TruecolourWithAlpha";
})(PngType || (PngType = {}));
var PNG = /** @class */ (function () {
    function PNG(pngData) {
        var upng = UPNG.decode(pngData);
        var frames = UPNG.toRGBA8(upng);
        if (frames.length > 1)
            throw new Error("Animated PNGs are not supported");
        var frame = new Uint8Array(frames[0]);
        var _a = splitAlphaChannel(frame), rgbChannel = _a.rgbChannel, alphaChannel = _a.alphaChannel;
        this.rgbChannel = rgbChannel;
        var hasAlphaValues = alphaChannel.some(function (a) { return a < 255; });
        if (hasAlphaValues)
            this.alphaChannel = alphaChannel;
        this.type = getImageType(upng.ctype);
        this.width = upng.width;
        this.height = upng.height;
        this.bitsPerComponent = 8;
    }
    PNG.load = function (pngData) { return new PNG(pngData); };
    return PNG;
}());
export { PNG };
//# sourceMappingURL=png.js.map