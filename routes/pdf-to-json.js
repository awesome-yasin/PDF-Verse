const express = require('express');
const multer = require('multer');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.get('/pdf-to-json', (req, res) => {
    res.render('pdf-to-json', { title: 'Convert PDF to JSON Files' });
  });

  router.post('/convert-pdf-to-json', upload.single('pdf'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const tempFilePath = req.file.path; // Path to the temporarily stored file

    let dataBuffer = fs.readFileSync(tempFilePath);

    pdfParse(dataBuffer).then(function(data) {
        fs.unlinkSync(tempFilePath); // Clean up: Delete the temporary file
        try {
            // Try to parse the extracted text as JSON
            const jsonData = JSON.parse(data.text);
            res.json(jsonData);
        } catch (error) {
            // If parsing fails, send the raw text
            res.json({ text: data.text });
        }
    }).catch(function(error) {
        fs.unlinkSync(tempFilePath); // Clean up: Delete the temporary file
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
