const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFDocument = require('pdf-lib');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/add-page-number', (req, res) => {
  res.render('addpagenumber');
});

router.post('/add-page-number', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.PDFDocument.load(req.file.buffer);
    const font = await pdfDoc.embedFont(PDFDocument.StandardFonts.HelveticaBold);
    let fontSize;
    switch (req.body.size) {
      case 'small':
        fontSize = 12;
        break;
      case 'medium':
        fontSize = 18;
        break;
      case 'large':
      default:
        fontSize = 24;
        break;
    }
    
    const pageCount = pdfDoc.getPageCount();

    for (let i = 0; i < pageCount; i++) {
      const page = pdfDoc.getPage(i);
      const { width, height } = page.getSize();
      let x, y;

      switch (req.body.format) {
        case 'top-right':
          x = width - 100;
          y = height - 50;
          break;

        case 'top-middle':
          x = width / 2;
          y = height - 50;
          break;

        case 'bottom-right':
          x = width - 100;
          y = 50;
          break;

        case 'bottom-middle':
          x = width / 2;
          y = 50;
          break;

        case 'bottom-left':
          x = 100;
          y = 50;
          break;

        case 'top-left':
        default:
          x = 100;
          y = height - 50;
          break;
      }

      await page.drawText(`Page ${i + 1}`, {
        x,
        y,
        size: fontSize,
        font,
        color: PDFDocument.rgb(0, 0, 0),
        opacity: 0.8,
      });
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
