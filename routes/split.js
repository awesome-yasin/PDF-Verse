const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const ejs = require('ejs');
const multer = require('multer');
const JSZip = require('jszip');

// Define the Multer memory storage
const memoryStorage = multer.memoryStorage();
// we are storing our Uploaded DOC in MemoryStorage rather than system file storage for ease of being it working in Deployed version of vercel
const upload = multer({ storage: memoryStorage });

// Define the route for the main page
router.get('/splitpdf', (req, res) => {
    res.render('split');
});

// Defining the route for the form submission
router.post('/split', upload.single('file'), async (req, res) => {
    try {
        // Loading the uploaded PDF file
        const pdfBytes = req.file.buffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const numPages = pdfDoc.getPageCount();

        // Parsing the page ranges from the form data
        const pageRanges = req.body.pageRanges.split(',');
        const splitPages = [];
        for (const range of pageRanges) {
            // Destructuring array in range and Split the "range" string into two numbers: "start" and "end" so if the input range is 3-7 the code will make start = 3 and end = 7 like this ["3", "7"]
            const [start, end] = range.split('-').map(Number);
            if (start > end || start < 1 || end > numPages) {
                throw new Error(`Invalid page range: ${range}`);
            }
            splitPages.push({ start: start - 1, end: end - 1 });
        }

        // Spliting the PDF into separate files
        const zip = new JSZip();
        for (const { start, end } of splitPages) {
            const newPdfDoc = await PDFDocument.create();
            for (let i = start; i <= end; i++) {
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                newPdfDoc.addPage(copiedPage);
            }
            const newPdfBytes = await newPdfDoc.save();
            zip.file(`pages_${start + 1}-${end + 1}.pdf`, newPdfBytes);
        }
        const zipBytes = await zip.generateAsync({ type: 'nodebuffer' });

        // Send the ZIP file as a download
        const fileName = 'split_pages.zip';
        res.set('Content-Type', 'application/zip');
        res.set('Content-Disposition', `attachment; filename="${fileName}"`);
        res.send(zipBytes);
    } catch (error) {
        // Render the error page
        console.log(error);
    }
});


// Export the router
module.exports = router;
