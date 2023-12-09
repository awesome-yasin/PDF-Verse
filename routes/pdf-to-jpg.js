const express = require('express');
const multer = require('multer');
// const pdf2img = require('pdf-img-convert-web');
const JSZip = require('jszip');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.get('/pdf-to-jpg', (req, res) => {
  res.render('pdf-to-jpg', { title: 'Convert PDF to JPG Images' });
});

// The controller part is done from Vanilla JS only because Vercel deployment is causing problem with Nodejs Canvas for NodeJs code reffer to pdf-to-png.js code.

module.exports = router;
