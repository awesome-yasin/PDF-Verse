const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

const customStyles = `
    body { 
        font-family: 'Helvetica', sans-serif; 
        margin: 40px; 
        line-height: 1.6;
        
        padding: 20px;
        color: #333;
    }
    h1, h2, h3, h4, h5, h6 { 
        text-align: center;
        color: #333;
    }
    p { 
        text-align: justify; 
        margin-bottom: 15px;
        text-align: center;
    }
    ul, ol {
        padding-left: 20px;
        margin-bottom: 15px;
        text-align: center;
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

chromium.setHeadlessMode = true;

router.post('/wordconvert', upload.single('documents'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    let result = null;
  let browser = null;

    try {
        const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer });
        
       browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,

      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
      headless:false,
    args: ["--no-sandbox"]

    });
        
        

        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: 'A4' });
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

