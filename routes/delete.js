const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFDocument = require('pdf-lib');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/delete', (req, res) => {
  res.render('delete');
});

router.post('/delete-pages', upload.single('pdfFile'), async (req, res) => {
  try {
    const pdfDoc = await PDFDocument.PDFDocument.load(req.file.buffer);

    const pageNumbers = req.body.pageNumbers.split(',').map(Number);

   pageNumbers.sort((a, b) => b - a);

    let numDeletedPages = 0;
    for (const pageNum of pageNumbers) {
      pdfDoc.removePage(pageNum - 1 - numDeletedPages);
      numDeletedPages++;
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
