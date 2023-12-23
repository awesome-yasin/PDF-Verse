const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdf-to-json', (req, res) => {
    res.render('pdf-to-json', { title: 'Convert PDF to JSON Files' });
  });

  router.post('/convert-pdf-to-json', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const fileBuffer = req.file.buffer;

    pdfParse(fileBuffer).then(function(data) {
        try {
            const jsonData = JSON.parse(data.text);
            res.json(jsonData);
        } catch (error) {
            res.json({ text: data.text });
        }
    }).catch(function(error) {
        console.error("PDF parsing error: ", error);
        res.status(500).send('Error processing PDF file.');
    });
});



function formatExtractedText(text) {
    // Remove unnecessary line breaks and spaces
    let formattedText = text.replace(/\n\s*\n/g, '\n');

    // Further formatting can be done here depending on the expected content
    // For example, you might want to convert it to a proper JSON object if it's JSON-like
    try {
        let jsonObject = JSON.parse(formattedText);
        return JSON.stringify(jsonObject, null, 4); // Beautify JSON
    } catch (e) {
        // If it's not valid JSON, return the original formatted text
        return formattedText;
    }
}


module.exports = router;
