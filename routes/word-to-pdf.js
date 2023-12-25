const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const mammoth = require('mammoth');
const puppeteer = require('puppeteer');
const router = express.Router();

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

router.post('/wordconvert', upload.single('documents'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    try {
        const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer });

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        
        // Combine the custom styles with the converted HTML
        const styledHtml = `<style>${customStyles}</style>${html}`;
        await page.setContent(styledHtml);

        const pdfBuffer = await page.pdf();
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
