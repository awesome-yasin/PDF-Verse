#### PDF WATERMARK

Watermark any pdf. Supports text as well as image.

**Options**

- **pdf_path** - your pdf path.
- **text** - define text to be written on text.
- **image_path** - Image path of watermark.
- **output_dir** - Destination pdf file.
- **imageOptions** - image option like opacity, size and more. supports other pdf-lib options'.
- **textOption** - text option like opacity, size and more. supports other pdf-lib options'.

**Example**

```
  const PDFWatermark= require('pdf-watermark');

  await PDFWatermark({
    pdf_path: "./newsletter.pdf", 
    image_path: "./everest.png",
    text: "Gentech", 
    output_dir: "./output.pdf", // remove to override file
  });

```

NOTE: you can use **text** only / **image_path** only or both at same time.

**More Options**

```
  const PDFWatermark= require('pdf-watermark');

  await PDFWatermark({
    pdf_path: "./newsletter.pdf",
    image_path: "./everest.png",
    imageOptions:{
      opacity:0.2,
      //other properties
    }
    textOption:{
        diagonally:true
    },
    imageOption:{
        size: 12,
        opacity: 0.6,
        x:5,
        y:20,
        diagonally:true
    }
  });

```

NOTE : To use diagonally it is best if you dont add other properties like size, x and y.

### Inspiration

[https://pdf-lib.js.org/](https://pdf-lib.js.org/)

[http://thecodebarbarian.com/working-with-pdfs-in-node-js.html](http://thecodebarbarian.com/working-with-pdfs-in-node-js.html)

### License(MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

## License

[MIT](LICENSE.md)
