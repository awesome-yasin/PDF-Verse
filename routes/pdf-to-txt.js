const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');


router.get('/pdf-to-txt', (req, res) => {
    res.render('pdf-to-txt', { title: 'Convert PDF to TXT converter' });
  });
  
  router.post('/convert-pdf-to-txt', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);
        res.setHeader('Content-Disposition', 'attachment; filename=converted.txt');
        res.setHeader('Content-Type', 'text/plain');
        res.send(data.text);
    } catch (error) {
        console.error("PDF parsing error: ", error);
        res.status(500).send('Error converting PDF to text.');
    }
});
module.exports = router;
