const express = require('express');
const multer = require('multer');
const pdf2img = require('pdf-img-convert');
const JSZip = require('jszip');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdftopng', (req, res) => {
  res.render('pdftopng', { title: 'Convert PDF to PNG' });
});

router.post('/png-convert', upload.single('file'), async (req, res) => {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    res.status(400).send('Please upload a valid PDF file.');
    return;
  }

  try {
    const pdfBuffer = req.file.buffer;
    const outputImages = await pdf2img.convert(pdfBuffer);

    const zip = new JSZip();

    outputImages.forEach((img, i) => {
      zip.file(`output${i}.png`, img);
    });

    zip.generateAsync({ type: 'nodebuffer' }).then(zipBuffer => {
      res.setHeader('Content-Disposition', 'attachment; filename=images.zip');
      res.setHeader('Content-Type', 'application/zip');
      res.send(zipBuffer);
    });

  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while processing the PDF file.');
  }
});

module.exports = router;
