/*  
    NOTE: This code will convert word documents to PDF here we first convert a word document to HTML file and then to PDF
    but this way is not being supported in vercel as we cant convert to html there due to some vercel dependeny issue so
    trying different way for it now.
*/

const express = require('express');
const multer = require('multer');
// const upload = multer({ storage: multer.memoryStorage() });
// const mammoth = require('mammoth');
// const pdf = require('html-pdf');
const router = express.Router();
const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');

router.use(bodyParser.text({ type: 'text/html' }));

// const customStyles = `
//     body { 
//         font-family: 'Helvetica', sans-serif; 
//         margin: 40px; 
//         line-height: 1.6;
        
//         padding: 20px;
//         color: #333;
//     }
//     h1, h2, h3, h4, h5, h6 { 
//         text-align: center;
//         color: #333;
//     }
//     p { 
//         text-align: justify; 
//         margin-bottom: 15px;
//         text-align: center;
//     }
//     ul, ol {
//         padding-left: 20px;
//         margin-bottom: 15px;
//         text-align: center;
//     }
//     li {
//         margin-bottom: 10px;
//     }
//     table {
//         width: 100%;
//         border-collapse: collapse;
        
//     }
//     th, td {
//         border: 1px solid #ddd;
//         padding: 8px;
//         text-align: left;
//     }
//     th {
//         background-color: #f2f2f2;
//     }
//     img {
//         max-width: 100%;
//         height: auto;
//         display: block;
//         margin: 0 auto;
//     }
//     .center-text {
//         text-align: center;
//     }
//     .page-break {
//         page-break-after: always;
//     }
// `;

router.get('/word-to-pdf', (req, res) => {
    res.render('word-to-pdf');
});

// router.post('/wordconvert', upload.single('documents'), async (req, res) => {
//     if (!req.file) {
//         return res.status(400).send('No file uploaded.');
//     }

//     try {
//         const { value: html } = await mammoth.convertToHtml({ buffer: req.file.buffer });

//         const styledHtml = `<style>${customStyles}</style>${html}`;

//         pdf.create(styledHtml).toBuffer((err, buffer) => {
//             if (err) {
//                 console.error('Conversion error:', err);
//                 return res.status(500).send('Error converting document.');
//             }
//             res.setHeader('Content-Disposition', 'attachment; filename=converted.pdf');
//             res.setHeader('Content-Type', 'application/pdf');
//             res.send(buffer);
//         });

//     } catch (error) {
//         console.error('Conversion error:', error);
//         res.status(500).send('Error converting document.');
//     }
// });

router.post('/convert-html-to-pdf', async (req, res) => {
    try {
        const html = req.body;
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);

        const pdfBuffer = await page.pdf({ format: 'A4' });
        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (err) {
        console.error('Conversion error:', err);
        res.status(500).send('Error converting document.');
    }
});

module.exports = router;

