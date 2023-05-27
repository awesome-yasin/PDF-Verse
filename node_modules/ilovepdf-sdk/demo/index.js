
const ilovepdfSDK = require('../lib/index');
const path = require('path');
const { project_public_id, secret_key } = require('./test/keys');

const sdk = new ilovepdfSDK(project_public_id, secret_key);

async function convertOfficeToPdf() {
  const inputFile = path.resolve(__dirname, 'test', 'demo.docx');
  const outputFile = path.resolve(__dirname, 'test', 'output.pdf');
  try {
    const task = await sdk.createTask('officepdf');

    await task.addFile(inputFile);

    const result = await task.process();
    console.log(result);

    await task.download(outputFile);
  } catch (e) {
    console.log(e);
  }
}

async function splitPDF() {
  const inputFile = path.resolve(__dirname, 'test', 'output.pdf');
  const outputFile = path.resolve(__dirname, 'test', 'split_output.zip');
  try {
    const task = await sdk.createTask('split');

    await task.addFile(inputFile, {
      rotate: 180
    });

    const result = await task.process({
      metas: {
        Title: 'New Documents',
      },
      split_mode: 'ranges',
      ranges: '1,2,3',
    });
    console.log(result);

    await task.download(outputFile);
  } catch (e) {
    console.log(e);
  }
}

async function test() {
  try {
    await convertOfficeToPdf();
    await splitPDF();
  } catch (e) {
    if (e.response && e.response.data) {
      console.log(JSON.stringify(e.response.data, null, 2));
    } else {
      console.log(e);
    }
  }

}


test();