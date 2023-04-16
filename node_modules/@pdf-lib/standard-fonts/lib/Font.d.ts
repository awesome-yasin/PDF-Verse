declare const compressedJsonForFontName: {
    'Courier': string;
    'Courier-Bold': string;
    'Courier-Oblique': string;
    'Courier-BoldOblique': string;
    'Helvetica': string;
    'Helvetica-Bold': string;
    'Helvetica-Oblique': string;
    'Helvetica-BoldOblique': string;
    'Times-Roman': string;
    'Times-Bold': string;
    'Times-Italic': string;
    'Times-BoldItalic': string;
    'Symbol': string;
    'ZapfDingbats': string;
};
export declare enum FontNames {
    Courier = "Courier",
    CourierBold = "Courier-Bold",
    CourierOblique = "Courier-Oblique",
    CourierBoldOblique = "Courier-BoldOblique",
    Helvetica = "Helvetica",
    HelveticaBold = "Helvetica-Bold",
    HelveticaOblique = "Helvetica-Oblique",
    HelveticaBoldOblique = "Helvetica-BoldOblique",
    TimesRoman = "Times-Roman",
    TimesRomanBold = "Times-Bold",
    TimesRomanItalic = "Times-Italic",
    TimesRomanBoldItalic = "Times-BoldItalic",
    Symbol = "Symbol",
    ZapfDingbats = "ZapfDingbats"
}
export declare type IFontNames = FontNames | keyof typeof compressedJsonForFontName;
export interface ICharMetrics {
    /** Decimal value of default character code (-1 if not encoded) */
    /** Width of character */
    WX: number;
    /** Character name (aka Glyph name) */
    N: string;
}
/**
 * [name_1 name_2 number_x]:
 *   Name of the first character in the kerning pair followed by the name of the
 *   second character followed by the kerning amount in the x direction
 *   (y is zero). The kerning amount is specified in the units of the character
 *   coordinate system.
 */
export declare type IKernPair = [string, string, number];
export declare class Font {
    static load: (fontName: IFontNames) => Font;
    Comment: string;
    FontName: string;
    FullName: string;
    FamilyName: string;
    Weight: string;
    CharacterSet: string;
    Version: string;
    Notice: string;
    EncodingScheme: string;
    ItalicAngle: number;
    UnderlinePosition: number;
    UnderlineThickness: number;
    CapHeight: number | void;
    XHeight: number | void;
    Ascender: number | void;
    Descender: number | void;
    StdHW: number;
    StdVW: number;
    IsFixedPitch: boolean;
    /**
     * [llx lly urx ury]:
     *   Font bounding box where llx, lly, urx, and ury are all numbers.
     */
    FontBBox: [number, number, number, number];
    CharMetrics: ICharMetrics[];
    KernPairs: IKernPair[];
    private CharWidths;
    private KernPairXAmounts;
    private constructor();
    getWidthOfGlyph: (glyphName: string) => number | void;
    getXAxisKerningForPair: (leftGlyphName: string, rightGlyphName: string) => number | void;
}
export {};
