var _PDF_DOC,
    _CURRENT_PAGE,
    _TOTAL_PAGES,
    _PAGE_RENDERING_IN_PROGRESS = 0,
    _CANVAS = document.querySelector('#pdf-canvas');
var _PNG_STORE = {};
async function showPDF(pdf_url) {
    document.querySelector("#pdf-loader").style.display = 'block';

    try {
        _PDF_DOC = await pdfjsLib.getDocument({ url: pdf_url });
    } catch (error) {
        alert(error.message);
    }

    _TOTAL_PAGES = _PDF_DOC.numPages;

    document.querySelector("#pdf-loader").style.display = 'none';
    document.querySelector("#pdf-contents").style.display = 'block';
    document.querySelector("#pdf-total-pages").innerHTML = _TOTAL_PAGES;
    document.querySelector("#download-zip-button").style.display = 'block';

    showPage(1);
}

async function showPage(page_no) {
    _PAGE_RENDERING_IN_PROGRESS = 1;
    _CURRENT_PAGE = page_no;

    document.querySelector("#pdf-next").disabled = true;
    document.querySelector("#pdf-prev").disabled = true;

    document.querySelector("#pdf-canvas").style.display = 'none';
    document.querySelector("#page-loader").style.display = 'block';

    document.querySelector("#pdf-current-page").innerHTML = page_no;

    try {
        var page = await _PDF_DOC.getPage(page_no);
    } catch (error) {
        alert(error.message);
    }

    var pdf_original_width = page.getViewport(1).width;

    var scale_required = _CANVAS.width / pdf_original_width;

    var viewport = page.getViewport(scale_required);

    _CANVAS.height = viewport.height;

    document.querySelector("#page-loader").style.height = _CANVAS.height + 'px';
    document.querySelector("#page-loader").style.lineHeight = _CANVAS.height + 'px';

    var render_context = {
        canvasContext: _CANVAS.getContext('2d'),
        viewport: viewport,
    };

    try {
        await page.render(render_context);
        
    } catch (error) {
        alert(error.message);
    }

    _PAGE_RENDERING_IN_PROGRESS = 0;

    document.querySelector("#pdf-next").disabled = false;
    document.querySelector("#pdf-prev").disabled = false;

    document.querySelector("#pdf-canvas").style.display = 'block';
    document.querySelector("#page-loader").style.display = 'none';
    

    convertPageToPNG(page, page_no).then(pngDataUrl => {
        _PNG_STORE[page_no] = pngDataUrl;
    });
}


async function convertPageToPNG(page_no) {
    try {
        const page = await _PDF_DOC.getPage(page_no);
        const scale_factor = 6; // Increase this value for better quality of PNG
        const dpi = 1200; // Increase this value for better quality of PNG

        const viewport = page.getViewport({ scale: scale_factor, dpi: dpi });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
            canvasContext: canvas.getContext('2d'),
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        return canvas.toDataURL('image/jpg');
    } catch (error) {
        console.error(`Error processing page ${page_no}: ${error.message}`);
        return null;
    }
}


async function downloadZip() {
    if (!window.zip) {
        window.zip = new JSZip();
    }

    for (let page_no = 1; page_no <= _TOTAL_PAGES; page_no++) {
        showPage(page_no);

        while (_PAGE_RENDERING_IN_PROGRESS) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const pngDataUrl = await convertPageToPNG(page_no);
        window.zip.file(`page-${page_no}.jpg`, pngDataUrl.split(';base64,').pop(), { base64: true });
    }

    window.zip.generateAsync({ type: 'blob' }).then(function (content) {
        const zipFileName = 'pdf_pages.zip';
        const link = document.createElement('a');
        link.href = URL.createObjectURL(content);
        link.download = zipFileName;
        link.click();
        window.zip = null;
    });
}

document.querySelector("#show-pdf-button").addEventListener('click', function () {
    const fileInput = document.querySelector("#pdf-input");
    if (fileInput.files.length > 0) {
        const pdf_url = URL.createObjectURL(fileInput.files[0]);
        showPDF(pdf_url);
    }
});

document.querySelector("#pdf-prev").addEventListener('click', function () {
    if (_CURRENT_PAGE != 1)
        showPage(--_CURRENT_PAGE);
});

document.querySelector("#pdf-next").addEventListener('click', function () {
    if (_CURRENT_PAGE != _TOTAL_PAGES)
        showPage(++_CURRENT_PAGE);
});

document.querySelector("#download-zip-button").addEventListener('click', function () {
    downloadZip();
});

