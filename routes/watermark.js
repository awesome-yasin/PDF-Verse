const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdf-lib');
const fs = require('fs');
const path = require('path');
 const Jimp = require('jimp');
const router = express.Router();
const fontkit = require('@pdf-lib/fontkit');
const upload = multer({
  storage: multer.memoryStorage(),
});

router.get('/watermark-pdf', (req, res) => {
  res.render('watermark');
});

router.post('/add-watermark', upload.single('pdf'), async (req, res) => {
  const watermarkText = req.body.watermarkText || 'confidential';
  const fontSize = parseInt(req.body.fontSize) || 42;
  const fontFamily = req.body.fontFamily;
  const opacity = parseFloat(req.body.opacity) || 0.3;
  const rotation = PDFDocument.degrees(parseInt(req.body.rotation));
  
  const pdfBuffer = req.file.buffer;
  const pdfDoc = await PDFDocument.PDFDocument.load(pdfBuffer);
  pdfDoc.registerFontkit(fontkit)
  let font;
  if (fontFamily === 'Arial') {
    font = await pdfDoc.embedFont(PDFDocument.StandardFonts.Helvetica);
  } else {
    // Load custom font file from disk
    const fontFilePath = path.join(__dirname, 'font', 'Ariana.ttf');
    const fontFile = fs.readFileSync(fontFilePath);
    // Embed custom font in the PDF document
    const customFont = await pdfDoc.embedFont(fontFile);
    font = customFont;
  }

  const pages = pdfDoc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = width / 2;
    const x = width / 2 - (font.widthOfTextAtSize(watermarkText, fontSize)) / 2;
    const y = height / 2 - (font.heightAtSize(fontSize)) / 2;

    page.drawText(watermarkText, {
      x,
      y,
      size: fontSize,
      font: font,
      opacity: opacity,
      rotate: rotation,
    });
  }

  const pdfBytes = await pdfDoc.save();

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
  res.send(Buffer.from(pdfBytes));
});


router.post('/add-image-watermark', upload.fields([{name: 'imgpdf'}, {name: 'img'}]), async (req, res) => {
  const watermarkImage = req.files['img'][0].buffer;
  const pdfBuffer = req.files['imgpdf'][0].buffer;
  const pdfDoc = await PDFDocument.PDFDocument.load(pdfBuffer);
  const pages = pdfDoc.getPages();
  const opacity = 0.5;
  for (const page of pages) {
    const { width, height } = page.getSize();
    const imageBuffer = await Jimp.read(watermarkImage);
    imageBuffer.autocrop();
    const imageDims = { width: imageBuffer.bitmap.width, height: imageBuffer.bitmap.height };
    const scale = Math.min(width / (imageDims.width * 4), height / (imageDims.height * 4));
    const x = (width - imageDims.width * scale) / 2;
    const y = (height - imageDims.height * scale) / 2;
    const pngBuffer = await imageBuffer.getBufferAsync(Jimp.MIME_PNG); 
    const pdfImage = await pdfDoc.embedPng(pngBuffer);
    page.drawImage(pdfImage, {
      x,
      y,
      
      width: imageDims.width * scale,
      height: imageDims.height * scale,
      opacity,
    });
  }
  const pdfBytes = await pdfDoc.save();
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=watermarked.pdf');
  res.send(Buffer.from(pdfBytes));
});


module.exports = router;
