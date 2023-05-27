const path = require('path');
const {execFile} = require('child_process');
const EXEC_OPTS = require('../index').exec_options;

let popplerPath = require('../index').path;

module.exports = function (file) {
    return new Promise((resolve, reject) => {
        execFile(path.join(popplerPath, 'pdfinfo'), [file], EXEC_OPTS, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            }
            else {
                let nfo = stdout.split(/\r?\n/);
                nfoObj = {};
                nfo.forEach(node => {
                    // split by first colon
                    let n = node.replace(/(^:)|(:$)/, '').split(/:(.+)/);
                    if (n[0]) {
                        nfoObj[n[0].replace(/ /g, "_").toLowerCase()] = n[1].trim();
                    }
                });

                let d = nfoObj['page_size'].split('x');

                // find dimensions in pixel
                nfoObj['width_in_pts'] = parseFloat(d[0]);
                nfoObj['height_in_pts'] = parseFloat(d[1]);

                // nfoObj['width_in_px'] = parseFloat(d[0])*96/72;
                // nfoObj['height_in_px'] = parseFloat(d[1])*96/72;

                resolve(nfoObj);
            }
        });
    });
};
