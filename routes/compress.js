const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

router.get('/compress-pdf', (req, res) => {
  res.render('compress');
});

router.post('/compress', upload.single('pdfFile'), async (req, res) => {
  const { originalname, path } = req.file;

  const formData = new FormData();
  formData.append('File', fs.createReadStream(path), { filename: originalname });

  const options = {
    method: 'POST',
    url: 'https://pdf4me.p.rapidapi.com/RapidApi/Compress',
    headers: {
      'Content-Type': 'multipart/form-data',
      Accept: '/',
      'X-RapidAPI-Key': '1209fd1450msh44e531e6c0e05fcp1179e8jsndaeb8a442e8b',
      'X-RapidAPI-Host': 'pdf4me.p.rapidapi.com',
      ...formData.getHeaders()
    },
    data: formData
  };

  try {
    const response = await axios.request(options);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${originalname}_compressed.pdf"`);
    res.send(response.data);
  } catch (error) {
    console.error(error);
    res.render('compress', { error: 'Error compressing PDF file' });
  }

  fs.unlinkSync(path);
});

module.exports = router;
