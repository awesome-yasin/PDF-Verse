const express = require('express');
const router = express.Router();
const fs = require('fs');
const pdfParse = require('pdf-parse');
const officegen = require('officegen');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.get('/pdftoword', (req, res) => {
    res.render('pdftoword');
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

    let out = fs.createWriteStream('output.docx');

    out.on('error', function(err) {
        console.log(err);
    });

    docx.generate(out);

    // Wait for the file write operation to finish, then download
    out.on('finish', function() {
        res.download('output.docx', function(err){
            if (err) {
                console.log(err);
            } else {
                console.log('File downloaded successfully');
            }
        });
    });
});

module.exports = router;
