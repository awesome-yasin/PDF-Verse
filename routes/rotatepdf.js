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

    // Adjust rotation degrees based on desired rotation direction
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

    // Load the PDF file into a PDFDocument object
    const pdfDoc = await PDFDocument.load(req.file.buffer);

    // Rotate all pages in the document by the specified degrees
    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      page.setRotation(degrees(rotationDegrees));
    });

    // Serialize the modified PDFDocument to a buffer
    const pdfBytes = await pdfDoc.save();

    // Set response headers to trigger browser download of modified PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=rotated.pdf`);

    // Send the modified PDF as a response to the client
    res.send(Buffer.from(pdfBytes));
  } catch (err) {
    console.error(err);
    res.status(500).send('Error rotating PDF');
  }
});

  
module.exports = router;