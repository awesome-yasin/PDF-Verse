const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdf-to-json', (req, res) => {
    res.render('pdf-to-json', { title: 'Convert PDF to JSON Files' });
  });

  router.post('/convert-pdf-to-json', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileBuffer = req.file.buffer;

    pdfParse(fileBuffer).then(function(data) {
        let jsonData;
        try {
            jsonData = JSON.parse(data.text);
        } catch (error) {
            jsonData = { text: data.text };
        }

        const jsonContent = JSON.stringify(jsonData, null, 4);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `converted-${timestamp}.json`;

        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', 'application/json');
        res.send(jsonContent);
    }).catch(function(error) {
        console.error("PDF parsing error: ", error);
        res.status(500).send('Error processing PDF file.');
    });
});




function formatExtractedText(text) {
    let formattedText = text.replace(/\n\s*\n/g, '\n');

    
    try {
        let jsonObject = JSON.parse(formattedText);
        return JSON.stringify(jsonObject, null, 4);
    } catch (e) {
        return formattedText;
    }
}


module.exports = router;
