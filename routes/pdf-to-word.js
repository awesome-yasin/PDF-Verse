const express = require('express');
const router = express.Router();
const pdfParse = require('pdf-parse');
const officegen = require('officegen');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/pdf-to-word', (req, res) => {
    res.render('pdf-to-word');
});

router.post('/convert', upload.single('file'), async (req, res) => {
    let pdfBuffer = req.file.buffer;

    let dataBuffer = await pdfParse(pdfBuffer);

    let docx = officegen('docx');
  
    docx.on('error', function(err) {
        console.log(err);
    });

    docx.on('finalize', function(written) {
        console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
    });

    docx.createP().addText(dataBuffer.text);

    res.attachment('output.docx');
    docx.generate(res);
});

module.exports = router;
