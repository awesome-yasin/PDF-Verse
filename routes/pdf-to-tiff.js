const express = require('express');
const multer = require('multer');
const JSZip = require('jszip');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdf-to-tiff', (req, res) => {
  res.render('pdf-to-tiff', { title: 'Convert PDF to TIFF Images' });
});


module.exports = router;
