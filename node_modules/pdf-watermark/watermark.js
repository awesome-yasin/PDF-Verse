const { PDFDocument, degrees } = require("pdf-lib");
const { writeFileSync, readFileSync } = require("fs");

async function PDFWatermark(options) {
  const { text, pdf_path, image_path, output_dir, imageOption = {}, textOption = {} } = options;

  if (!pdf_path) {
        throw Error('Please add pdf_path in options.');
  }

  // load pdf
  const document = await PDFDocument.load(readFileSync(pdf_path));

  //   get pages and number of pages
  const pages = document.getPages();
  const numberOfPages = pages.length;

  // loop throgh all pages
  if (text) {
    for (let i = 0; i < numberOfPages; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // diagonally rotate text
      if (textOption?.diagonally == true) {
        textOption.rotate = degrees(-45);
        textOption.x = width / 2 - text.length * 9;
        textOption.y = height / 2 + 200;
        textOption.size = 50;
      }

      // text watermark
      await page.drawText(text, {
        x: width / 2 - text.length * 9, // center with left padding for text
        y: height / 2 - 20,
        size: 12,
        opacity: 0.6,
        ...textOption,
      });
    }
  }

  // image watermark
  if (image_path) {
    // load image
    const emblemImageBytes = readFileSync(image_path);
    const image = await document.embedPng(emblemImageBytes);
    const pngDims = image.scale(0.5);

    // loop throgh all pages
    for (let i = 0; i < numberOfPages; i++) {
      const page = pages[i];
      const { width, height } = page.getSize();

      // diagonally rotate text
      if (imageOption?.diagonally == true) {
        imageOption.rotate = degrees(-45);
        imageOption.x = width / 2;
        imageOption.y = height / 2 + 200;
      }

      await page.drawImage(image, {
        x: width / 2 - pngDims.width / 2 + 15,
        y: height / 2 - pngDims.height - 20,
        width: pngDims.width,
        height: pngDims.height,
        opacity: 0.6,
        ...imageOption,
      });
    }
  }

  // write to file
  writeFileSync(output_dir || pdf_path, await document.save());
}

// (async function () {
//   await PDFWatermark({
//     pdf_path: "./newsletter.pdf",
//     text: "Gentech",
//     output_dir: "./output.pdf",
//     image_path: "./everest.png",
//   });
// })();

module.exports = PDFWatermark;
