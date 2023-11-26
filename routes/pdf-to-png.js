const express = require('express');
const multer = require('multer');
// const pdf2img = require('pdf-img-convert-web');
const JSZip = require('jszip');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdf-to-png', (req, res) => {
  res.render('pdf-to-png', { title: 'Convert PDF to Images' });
});

// Due to some error in vercel it is not able to handle this code and crashing uncomment this and it will work locally or elsewhere you deploy

// router.post('/png-convert', upload.single('file'), async (req, res) => {
//   if (!req.file || req.file.mimetype !== 'application/pdf') {
//     res.status(400).send('Please upload a valid PDF file.');
//     return;
//   }

//   try {
//     const pdfBuffer = req.file.buffer;

//     // Convert PDF to images
//     const outputImages = await pdf2img.convert(pdfBuffer, {
//       width: 800, // Specify the width of the output images
//       base64: true, // Set to true for base64-encoded image output
//     });

//     // Create a zip file containing the images
//     const zip = new JSZip();

//     outputImages.forEach((img, i) => {
//       zip.file(`output${i}.png`, img);
//     });

//     // Send the zip file as a response
//     zip.generateAsync({ type: 'nodebuffer' }).then(zipBuffer => {
//       res.setHeader('Content-Disposition', 'attachment; filename=images.zip');
//       res.setHeader('Content-Type', 'application/zip');
//       res.send(zipBuffer);
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('An error occurred while processing the PDF file.');
//   }
// });

module.exports = router;
