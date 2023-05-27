# pdf-poppler

Convert PDF files into images using Poppler with promises. It achieves 10x faster performance compared to other PDF converters.
Poppler library attached inside statically, so it has not require installation of poppler.

**Note: Currently it supports for Windows and Mac OS only.**

## Installation
```
  $ npm install pdf-poppler
```

## Usage

### Get pdf info

```javascript
const pdf = require('pdf-poppler');

let file = 'C:\\tmp\\convertme.pdf'

pdf.info(file)
    .then(pdfinfo => {
        console.log(pdfinfo);
    });
```

### Convert pdf into image

```javascript
const path = require('path');
const pdf = require('pdf-poppler');

let file = 'C:\\tmp\\convertme.pdf'

let opts = {
    format: 'jpeg',
    out_dir: path.dirname(file),
    out_prefix: path.baseName(file, path.extname(file)),
    page: null
}

pdf.convert(file, opts)
    .then(res => {
        console.log('Successfully converted');
    })
    .catch(error => {
        console.error(error);
    })
```