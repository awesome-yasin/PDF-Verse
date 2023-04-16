declare type EncodingCharCode = number;
declare type EncodingCharName = string;
interface UnicodeMappings {
    [unicodeCodePoint: number]: [EncodingCharCode, EncodingCharName];
}
declare type EncodingNames = 'Symbol' | 'ZapfDingbats' | 'WinAnsi';
declare class Encoding {
    name: EncodingNames;
    supportedCodePoints: number[];
    private unicodeMappings;
    constructor(name: EncodingNames, unicodeMappings: UnicodeMappings);
    canEncodeUnicodeCodePoint: (codePoint: number) => boolean;
    encodeUnicodeCodePoint: (codePoint: number) => {
        code: number;
        name: string;
    };
}
export declare type EncodingType = Encoding;
export declare const Encodings: {
    Symbol: Encoding;
    ZapfDingbats: Encoding;
    WinAnsi: Encoding;
};
export {};
