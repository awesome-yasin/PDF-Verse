const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFDocument = require('pdf-lib');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/add-page-number', (req, res) => {
  res.render('addPageNumber');
});

router.post('/add-page-number', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.PDFDocument.load(req.file.buffer);

    const format = req.body.format;

    const font = await pdfDoc.embedFont(PDFDocument.StandardFonts.HelveticaBold);

    const fontSize = 24;
    const pageCount = pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      const text = await page.drawText(`Page ${i + 1}`, {
        x: width - 100,
        y: 50,
        size: fontSize,
        font: font,
        color: PDFDocument.rgb(0, 0, 0),
        opacity: 0.8,
        return: true,
      });

      switch (format) {
        case 'top-left':
          text.setX(50);
          text.setY(height - 50);
          break;

        case 'top-right':
          text.setX(width - 100);
          text.setY(height - 50);
          break;

        case 'bottom-left':
          text.setX(50);
          text.setY(50);
          break;

        case 'bottom-right':
        default:
          break;
      }
    }
    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=modified.pdf');
    res.send(Buffer.from(pdfBytes));
    
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal server error');
  }
});

module.exports = router;
