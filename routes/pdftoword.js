const express = require('express');
const router = express.Router();
const fs = require('fs');
const { PDFDocument, PDFExtract } = require('pdf-lib');
const officegen = require('officegen');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const pdfjs = require('pdfjs-dist');

router.get('/pdftoword', (req, res) => {
  res.render('pdftoword');
});

router.post('/convert', upload.single('file'), async (req, res) => {
  let pdfBuffer = req.file.buffer;

  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const pageCount = pdfDoc.getPageCount();

  let docx = officegen('docx');

  docx.on('error', function (err) {
    console.log(err);
  });

  const pdfjsWorker = pdfjs.createWorker();
  const pdfData = new Uint8Array(pdfBuffer);
  await pdfjsWorker.load();
  const doc = await pdfjs.getDocument({ data: pdfData, worker: pdfjsWorker }).promise;

  for (let i = 1; i <= pageCount; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map(item => item.str).join(' ');
    docx.createP().addText(text);
  }

  let out = fs.createWriteStream('output.docx');

  out.on('error', function (err) {
    console.log(err);
  });

  docx.generate(out);

  out.on('finish', function () {
    res.download('output.docx', function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('File downloaded successfully');
      }
    });
  });
});

module.exports = router;
