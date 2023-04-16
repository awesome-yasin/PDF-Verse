const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Set up the middleware for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

let pdfFiles = [];

router.get('/', (req, res) => {
  res.render('index', { pdfFiles });
});

router.post('/merge', upload.array('pdfs'), async (req, res) => {
  try {
    const pdfs = req.files.map((file) => file.buffer);
    const mergedPdf = await mergePdfs(pdfs);

    // Send the merged PDF file as a response
    const fileName = 'merged.pdf';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    });
    res.send(Buffer.from(mergedPdf));
    
    // Store the uploaded PDF files in an array for display on the page
    pdfFiles = req.files.map((file) => file.originalname);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while merging the PDFs');
  }
});



// Set up the route for deleting uploaded PDF files
router.get('/delete/:index', (req, res) => {
  const { index } = req.params;
  const fileName = pdfFiles[index];
  pdfFiles.splice(index, 1);
  res.redirect('/');
});

async function mergePdfs(pdfs) {
  const mergedPdf = await PDFDocument.create();
  for (const pdf of pdfs) {
    const sourcePdf = await PDFDocument.load(pdf);
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    for (const page of pages) {
      mergedPdf.addPage(page);
    }
  }
  return mergedPdf.save();
}

module.exports = router;
