const express = require('express');
const multer = require('multer');
const router = express.Router();

const { PDFDocument } = require('pdf-lib');
const app = express();

// Set up the storage for uploaded files
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Route to display the form for uploading PDF files
router.get('/pdfeditor', (req, res) => {
  res.render('pdfeditor', { title: 'PDF Editor' });
});

// Route to handle the form submission and display the PDF editor
router.post('/editor', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    // If no file is uploaded, show an error message
    res.render('editor', { title: 'PDF Editor', error: 'Please select a PDF file to upload.' });
  } else {
    try {
      // Load the uploaded PDF file using pdf-lib
      const pdfDoc = await PDFDocument.load(req.file.buffer);

      // Get the number of pages in the PDF document
      const numPages = pdfDoc.getPageCount();

      // Embed the PDF file in the HTML response using a data URI scheme
      const dataUri = `data:application/pdf;base64,${req.file.buffer.toString('base64')}`;
      res.render('main-editor', { title: 'PDF Editor', numPages, dataUri });
    } catch (err) {
      // If there is an error loading the PDF document, show an error message
      res.render('editor', { title: 'PDF Editor', error: `Error loading PDF file: ${err.message}` });
    }
  }
});

module.exports = router;
