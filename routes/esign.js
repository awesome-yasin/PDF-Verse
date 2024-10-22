const express = require("express");
const multer = require("multer");
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// Multer configuration for file upload
const upload = multer({ dest: "uploads/" });

router.get("/esign-pdf", (req, res) => {
  res.render("esign"); // Ensure this ejs file exists in your views
});

router.post("/esign", upload.single("pdfFile"), async (req, res) => {
  try {
    // Extract file and form data
    const { signatureText, fontSize, color, xPos, yPos } = req.body;
    const pdfPath = req.file.path;

    // Read the uploaded PDF file
    const pdfBytes = fs.readFileSync(pdfPath);

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Convert color from string to RGB array
    const [r, g, b] = color.split(",").map(Number);

    // Add text to the first page
    firstPage.drawText(signatureText, {
      x: parseInt(xPos, 10),
      y: parseInt(yPos, 10),
      size: parseInt(fontSize, 10),
      color: rgb(r, g, b),
    });

    // Save the signed PDF
    const signedPdfBytes = await pdfDoc.save();
    const signedPdfPath = path.join(
      __dirname,
      "../uploads/signed_" + req.file.originalname
    );
    fs.writeFileSync(signedPdfPath, signedPdfBytes);

    // Send the signed PDF back to the client or download
    res.download(signedPdfPath, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        res.status(500).send("Error signing the PDF");
      }

      // Clean up uploaded files
      fs.unlinkSync(pdfPath);
      fs.unlinkSync(signedPdfPath);
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    res.status(500).send("Error processing the PDF");
  }
});

module.exports = router;
