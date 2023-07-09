const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get('/compress', (req, res) => {
  res.render('compress');
});

router.post('/compress', upload.single('pdf'), (req, res) => {
  const inputFile = req.file.buffer;
  const outputFile = `compressed_${Date.now()}.pdf`;

  const compressionLevel = req.body.compressionLevel;

  let gsArgs;
  switch (compressionLevel) {
    case 'low':
      gsArgs = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/printer',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        `-sOutputFile=${outputFile}`,
        '-',
      ];
      break;
    case 'normal':
      gsArgs = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/printer',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        `-sOutputFile=${outputFile}`,
        '-',
      ];
      break;
    case 'high':
      gsArgs = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/screen',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        '-dColorImageResolution=72',
        '-dGrayImageResolution=72',
        '-dMonoImageResolution=72',
        '-dDownsampleColorImages=true',
        '-dDownsampleGrayImages=true',
        '-dDownsampleMonoImages=true',
        '-dColorImageDownsampleType=/Bicubic',
        '-dGrayImageDownsampleType=/Bicubic',
        '-dMonoImageDownsampleType=/Bicubic',
        '-dColorImageFilter=/FlateEncode',
        '-dGrayImageFilter=/FlateEncode',
        '-dMonoImageFilter=/FlateEncode',
        '-dEmbedAllFonts=false',
        '-dSubsetFonts=true',
        '-dDOPDFMARKS=false',
        '-dDOPDFMARKPROT=false',
        '-dConvertCMYKImagesToRGB=true',
        '-dCompressFonts=true',
        '-dOptimize=true',
        '-dDetectDuplicateImages=true',
        '-dPreserveCopyPage=false',
        '-dPreserveEPSInfo=false',
        '-dPreserveHalftoneInfo=false',
        '-dPreserveOPIComments=false',
        '-dPreserveOverprintSettings=false',
        '-dPreserveSeparation=false',
        '-dPreserveTrapped=false',
        '-dPreserveType1Output=false',
        '-sOutputFile=' + outputFile,
        '-',
      ];
      break;
    case 'extreme':
      gsArgs = [
        '-sDEVICE=pdfwrite',
        '-dCompatibilityLevel=1.4',
        '-dPDFSETTINGS=/screen',
        '-dNOPAUSE',
        '-dQUIET',
        '-dBATCH',
        '-dColorImageResolution=72',
        '-dGrayImageResolution=72',
        '-dMonoImageResolution=72',
        '-dDownsampleColorImages=true',
        '-dDownsampleGrayImages=true',
        '-dDownsampleMonoImages=true',
        '-dColorImageDownsampleType=/Subsample',
        '-dGrayImageDownsampleType=/Subsample',
        '-dMonoImageDownsampleType=/Subsample',
        '-dColorImageFilter=/FlateEncode',
        '-dGrayImageFilter=/FlateEncode',
        '-dMonoImageFilter=/FlateEncode',
        '-dEmbedAllFonts=false',
        '-dSubsetFonts=true',
        '-dDOPDFMARKS=false',
        '-dDOPDFMARKPROT=false',
        `-sOutputFile=${outputFile}`,
        '-',
      ];
      break;
    default:
      // Invalid compression level
      res.status(400).send('Invalid compression level.');
      return;
  }

  const gsProcess = spawn('C:/Program Files/gs/gs10.01.2/bin/gswin64c.exe', gsArgs);

  gsProcess.stdout.on('data', (data) => {
    // Handle output from Ghostscript if needed
  });

  gsProcess.stderr.on('data', (data) => {
    // Handle error output from Ghostscript if needed
  });

  gsProcess.on('close', (code) => {
    if (code === 0) {
      // Compression successful
      res.set('Content-Type', 'application/pdf');
      res.set('Content-Disposition', `attachment; filename=${outputFile}`);
      res.send(gsProcess.stdout);
    } else {
      // Compression failed
      res.status(500).send('Failed to compress the PDF.');
    }
  });

  gsProcess.stdin.write(inputFile);
  gsProcess.stdin.end();
});

module.exports = router;
