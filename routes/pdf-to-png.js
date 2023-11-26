const express = require('express');
const multer = require('multer');
const JSZip = require('jszip');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdf-to-png', (req, res) => {
  res.render('pdf-to-png', { title: 'Convert PDF to PNG' });
});

module.exports = router;
