const os = require('os');
const path = require('path');
const {spawn} = require('child_process');

let platform = os.platform();
if (!['darwin', 'win32'].includes(platform)) {
    console.error(`${platform} is NOT supported.`);
    process.exit(1);
}

let popplerPath;

let execOptions = {
    encoding: 'utf8',
    maxBuffer: 5000*1024,
    shell: false
};

if (platform === 'win32') {
    popplerPath = path.join(
        __dirname,
        'lib',
        'win',
        'poppler-0.51',
        'bin'
    );

    // for electron ASAR
    popplerPath = popplerPath.replace(".asar", ".asar.unpacked");
}
else if (platform === 'darwin') {
    popplerPath = path.join(
        __dirname,
        'lib',
        'osx',
        'poppler-0.66',
        'bin'
    );

    let dyldPath = path.join(
        __dirname,
        'lib',
        'osx',
        'poppler-0.66',
        'lib'
    );

    let libRoot = path.join(
        __dirname,
        'lib',
        'osx'
    );

    // for electron ASAR
    popplerPath = popplerPath.replace(".asar", ".asar.unpacked");
    dyldPath = dyldPath.replace(".asar", ".asar.unpacked");
    libRoot = libRoot.replace(".asar", ".asar.unpacked");

    // make files executable
    spawn('chmod', ['-R', '755', `${libRoot}`]);

    // change name for every executables
    spawn('install_name_tool', ['-change', `/usr/local/Cellar/poppler/0.66.0/lib/libpoppler.77.dylib`, `${path.join(dyldPath, 'libpoppler.77.0.0.dylib')}`, `${path.join(popplerPath, 'pdfinfo')}`]);
    spawn('install_name_tool', ['-change', `/usr/local/Cellar/poppler/0.66.0/lib/libpoppler.77.dylib`, `${path.join(dyldPath, 'libpoppler.77.0.0.dylib')}`, `${path.join(popplerPath, 'pdftocairo')}`]);
    spawn('install_name_tool', ['-change', `/usr/local/Cellar/poppler/0.66.0/lib/libpoppler.77.dylib`, `${path.join(dyldPath, 'libpoppler.77.0.0.dylib')}`, `${path.join(popplerPath, 'pdfimages')}`]);
}
else {
    console.error(`${platform} is NOT supported.`);
    process.exit(1);
}

module.exports.path = popplerPath;
module.exports.exec_options = execOptions;
module.exports.info = require('./lib/info');
module.exports.imgdata = require('./lib/imgdata');
module.exports.convert = require('./lib/convert');