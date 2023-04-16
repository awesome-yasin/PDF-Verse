<h1>
  standard-fonts

  <br />

  <!-- NPM Version -->
  <a href="https://www.npmjs.com/package/standard-fonts">
    <img
      src="https://img.shields.io/npm/v/@pdf-lib/standard-fonts.svg?style=flat-square"
      alt="NPM Version"
    />
  </a>

  <!-- Prettier Badge -->
  <a href="https://prettier.io/">
    <img
      src="https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square"
      alt="Prettier Badge"
    />
  </a>
</h1>

> Collection of metrics and encodings for the standard 14 PDF fonts

This project is a fork of [`afm`](https://github.com/chbrown/afm) and was created for use in [`pdf-lib`](https://github.com/Hopding/pdf-lib). This forks exists for two primary reasons:

1. The original project did not include mappings from Unicode to WinAnsi/ZapfDingbats/Symbol encodings.
2. The font metrics included in the original project were uncompressed (not ideal for usage in `pdf-lib`).

## Usage
```js
import { Font, FontNames, Encodings } from '@pdf-lib/standard-fonts';

const codePoint = '∑'.charCodeAt(0);

const glyph = Encodings.Symbol.encodeUnicodeCodePoint(codePoint);
glyph // => { code: 229, name: 'summation' }

const font = Font.load(FontNames.Symbol);
const width = font.getWidthOfGlyph(glyph.name);
width // => 713
```

## Installation
### NPM Module
To install the latest stable version:
```bash
# With npm
npm install --save @pdf-lib/standard-fonts

# With yarn
yarn add @pdf-lib/standard-fonts
```
This assumes you're using [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/lang/en/) as your package manager.

### UMD Module
You can also download `@pdf-lib/standard-fonts` as a UMD module from [unpkg](https://unpkg.com/#/). The UMD builds have been compiled to ES5, so they should work [in any modern browser](https://caniuse.com/#feat=es5). UMD builds are useful if you aren't using a package manager or module bundler. For example, you can use them directly in the `<script>` tag of an HTML page.

The following builds are available:

* https://unpkg.com/@pdf-lib/standard-fonts/dist/standard-fonts.js
* https://unpkg.com/@pdf-lib/standard-fonts/dist/standard-fonts.min.js

When using a UMD build, you will have access to a global `window.StandardFonts` variable. This variable contains the classes and enums exported by `@pdf-lib/standard-fonts`. For example:

```javascript
// NPM module
import { Font, FontNames, Encodings } from '@pdf-lib/standard-fonts';
const font = Font.load(FontNames.HelveticaBold);
const encoding = Encodings.WinAnsi;

// UMD module
var font = StandardFonts.Font.load(StandardFonts.FontNames.HelveticaBold);
var encoding = StandardFonts.Encodings.WinAnsi;
```

## License
[MIT](https://choosealicense.com/licenses/mit/)

## Original Repo's License

Copyright 2015–2018 Christopher Brown.
[MIT Licensed](https://chbrown.github.io/licenses/MIT/#2015-2018).
