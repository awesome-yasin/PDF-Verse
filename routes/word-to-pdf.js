const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const mammoth = require('mammoth');
const pdf = require('html-pdf');
const router = express.Router();
var chromium = require("chrome-aws-lambda");
var playwright = require("playwright-core");

const customStyles = `
    body { 
        font-family: 'Helvetica', sans-serif; 
        margin: 40px; 
        line-height: 1.6;
        
        padding: 20px;
        color: #333;
    }
    h1, h2, h3, h4, h5, h6 { 
        
        color: #333;
    }
    p { 
        text-align: justify; 
        margin-bottom: 15px;
        
    }
    ul, ol {
        padding-left: 20px;
        margin-bottom: 15px;
       
    }
    li {
        margin-bottom: 10px;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        
    }
    th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #f2f2f2;
    }
    img {
        max-width: 100%;
        height: auto;
        display: block;
        margin: 0 auto;
    }
    .center-text {
        text-align: center;
    }
    .page-break {
        page-break-after: always;
    }
`;

router.get('/word-to-pdf', (req, res) => {
    res.render('word-to-pdf');
});

router.post('/wordconvert', upload.single('documents'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer });

         // Launching the browser with chrome-aws-lambda
         const browser = await playwright.chromium.launch({
            args: [...chromium.args, "--font-render-hinting=none"],
            executablePath:
              process.env.NODE_ENV === "production"
                ? await chromium.executablePath
                : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
            headless:
              process.env.NODE_ENV === "production" ? chromium.headless : true,
          });

        const page = await browser.newPage();
        await page.setContent(`<style>${customStyles}</style>${html}`);

        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        await browser.close();

        res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Conversion error:', error);
        res.status(500).send('Error converting document.');
    }
});

module.exports = router;


// NOTE: This code will be using An API for better conversion use this API but it will be paid.
/*

const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});
const upload = multer({ storage: storage });

router.get('/word-to-pdf', (req, res) => {
    res.render('word-to-pdf');
});


router.post('/upload-word-file', upload.single('documents'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const API_KEY = '---API KEY---';

    try {
        const [uploadUrl, uploadedFileUrl] = await getPresignedUrl(API_KEY, req.file);

        await uploadFile(uploadUrl, req.file.path);

        const response = await convertDocToPdf(API_KEY, uploadedFileUrl);

        res.json({ pdfUrl: response.url });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error processing the file.');
    } finally {
    }
});

async function getPresignedUrl(apiKey, file) {
    const response = await axios.get(`https://api.pdf.co/v1/file/upload/get-presigned-url?contenttype=application/octet-stream&name=${path.basename(file.originalname)}`, {
        headers: { 'x-api-key': apiKey }
    });
    return [response.data.presignedUrl, response.data.url];
}

async function uploadFile(uploadUrl, filePath) {
    const fileContent = fs.readFileSync(filePath);
    await axios.put(uploadUrl, fileContent, {
        headers: { 'Content-Type': 'application/octet-stream' }
    });
}

async function convertDocToPdf(apiKey, uploadedFileUrl) {
    const response = await axios.post('https://api.pdf.co/v1/pdf/convert/from/doc', {
        url: uploadedFileUrl,
        name: path.basename(uploadedFileUrl)
    }, {
        headers: { 'x-api-key': apiKey }
    });
    return response.data;
}

module.exports = router;


*/
