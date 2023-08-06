const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const pdf2table = require('pdf2table');
const excel = require('excel4node');

const router = express.Router();

function validateSelectedPages(selectedPages, totalPages) {
    let pageRanges = selectedPages.split(',').map(range => range.split('-').map(Number));
    return pageRanges.every(range => {
        let [start, end] = range;
        return start >= 1 && end <= totalPages && start <= end;
    });
}

function applyCellStyle(cell, isHeader = false) {
    const style = {
      font: isHeader ? { bold: true, name: 'Arial', size: 12 } : { name: 'Arial', size: 12 },
      border: {
        left: { style: 'thin', color: '#000000' },
        right: { style: 'thin', color: '#000000' },
        top: { style: 'thin', color: '#000000' },
        bottom: { style: 'thin', color: '#000000' }
      }
    };
    
    cell.style(style);
  }
  

  




router.get('/pdftoexcel', (req, res) => {
    res.render('pdftoexcel');
});

router.post('/excel-convert', upload.single('file'), (req, res) => {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
        res.status(400).send('Please upload a valid PDF file.');
        return;
    }

    const { selectedFormat, selectedPages, tableOption } = req.body;

    pdf2table.parse(req.file.buffer, (err, rows, pages) => {
        if (err) {
            console.error(err);
            res.status(500).send('An unexpected error occurred');
            return;
        }

        if (selectedPages && !validateSelectedPages(selectedPages, pages.length)) {
            res.status(400).send('Invalid selected pages range.');
            return;
        }

        rows = handleSelectedPages(rows, selectedPages);

        
        if (tableOption === 'Flatten') {
            rows = flattenTables(rows);
        }

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Sheet 1');

        rows.forEach((row, rowIndex) => {
            row.forEach((cellValue, cellIndex) => {
              const cell = worksheet.cell(rowIndex + 1, cellIndex + 1);
              cell.string(cellValue || '');
              applyCellStyle(cell, rowIndex === 0);
            });
          });
          
        res.setHeader('Content-Type', 'application/vnd.openxmlformats');
        res.setHeader('Content-Disposition', `attachment; filename=output${selectedFormat}`);

        workbook.writeToBuffer().then(buffer => {
            res.send(buffer);
        });
    });
});

function handleSelectedPages(rows, selectedPages, totalPages) {
    if (!selectedPages) return rows;

    let selectedLines = [];
    let pageRanges = selectedPages.split(',').map(range => range.split('-').map(Number));

    pageRanges.forEach(range => {
        let [start, end] = range;
        end = end || start;

        start = Math.max(1, Math.min(start, totalPages));
        end = Math.max(1, Math.min(end, totalPages));

        for (let i = start; i <= end; i++) {
            selectedLines.push(...rows[i - 1]);
        }
    });

    return selectedLines;
}

function flattenTables(rows) {
    return rows.reduce((flattened, table) => {
        return flattened.concat(table);
    }, []);
}

module.exports = router;
