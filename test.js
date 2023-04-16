const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const sharp = require('sharp');
const router = express.Router();
const pdf2pic = require('pdf2pic');

const upload = multer({ dest: 'uploads/' });
router.get('/compress-pdf', (req, res) => {
  res.render('compress');
});

router.post('/compress', upload.single('pdfFile'), async (req, res) => {
  const pdfBuffer = fs.readFileSync(req.file.path);
  const pdfDoc = await PDFDocument.load(pdfBuffer);

  // Remove metadata
  pdfDoc.setTitle('');
  pdfDoc.setAuthor('');
  pdfDoc.setSubject('');
  pdfDoc.setKeywords([]);
  pdfDoc.setProducer('');
  pdfDoc.setCreator('');

  // Convert PDF pages to images, compress them, and add them back to a new PDF
  const newPdfDoc = await PDFDocument.create();
  const pageCount = pdfDoc.getPages().length;

  // Configure pdf2pic options
  const pdf2picOptions = {
    format: 'png',
    size: '600x600',
    density: 72,
    savePath: './temp-images',
  };
  const converter = pdf2pic(pdf2picOptions);

  for (let i = 0; i < pageCount; i++) {
    const page = pdfDoc.getPages()[i];
    const { width, height } = page.getSize();

    // Convert PDF page to PNG image using pdf2pic
    const imagePath = await converter.convertBulk(page, -1);

    // Read PNG image into buffer
    const pngImage = fs.readFileSync(imagePath);

    // Compress image using Sharp
    const compressedImage = await sharp(pngImage)
      .resize(width, height, { fit: 'inside' })
      .jpeg({ quality: 50 })
      .toBuffer();

    // Add compressed image to new PDF document
    const newImage = await newPdfDoc.embedJpg(compressedImage);
    const newPage = newPdfDoc.addPage([width, height]);
    newPage.drawImage(newImage, {
      x: 0,
      y: 0,
      width,
      height,
    });

    // Delete temporary PNG image
    fs.unlinkSync(imagePath);
  }

  const compressedPdfBytes = await newPdfDoc.save();
  fs.writeFileSync('compressed.pdf', compressedPdfBytes);

  // Clean up uploaded file
  fs.unlinkSync(req.file.path);

  res.download('compressed.pdf', 'compressed.pdf', (err) => {
    if (err) throw err;
    fs.unlinkSync('compressed.pdf');
  });
});

module.exports = router;