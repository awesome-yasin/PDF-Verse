const express = require('express');
const router = express.Router();
const { degrees } = require('pdf-lib');
const { PDFDocument, rgb } = require('pdf-lib');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/rotate-pdf', (req, res) => {
    res.render('rotate');
});

router.post('/rotate-pdf-form', upload.single('file'), async (req, res) => {
  try {
    const rotationDirection = req.body.rotationDirection;
    let rotationDegrees = 0;

    switch (rotationDirection) {
      case 'left':
        rotationDegrees += 270;
        break;
      case 'right':
        rotationDegrees += 90;
        break;
      case 'upsideDown':
        rotationDegrees += 180;
        break;
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      page.setRotation(degrees(rotationDegrees));
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rotated.pdf`);

    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rotating PDF');
  }
});

  
module.exports = router;