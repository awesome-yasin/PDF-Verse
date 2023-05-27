# node-ilovepdf-sdk

node.js SDK for [iLovePDF REST API](https://developer.ilovepdf.com)

[![NPM](https://nodei.co/npm/ilovepdf-sdk.png)](https://npmjs.org/package/ilovepdf-sdk)

Develop and automate PDF processing tasks like Compress PDF, Merge PDF, Split PDF, convert Office to PDF, PDF to JPG, Images to PDF, add Page Numbers, Rotate PDF, Unlock PDF, stamp a Watermark and Repair PDF. Each one with several settings to get your desired results.

## Install & Register Developer Account
```bash
$ npm install ilovepdf-sdk
```
You can sign up for a iLovePDF account at https://developer.ilovepdf.com

## Quick Start

```javascript
const ilovepdfSDK = require('ilovepdf-sdk');
const sdk = new ilovepdfSDK('PROJECT_PUBLIC_ID','SECRET_KEY');

async function convertOfficeToPdf() {
  const task = await sdk.createTask('officepdf');
  await task.addFile('./input.docx');
  await task.process();
  await task.download('./ouput.pdf');
}

```
## More Examples

See demo/index.js.

## API

### new ilovepdfSDK(projectId, secretKey)
Create sdk instance.

### sdk.createTask(taskType)
Create a task.

Task Type List

* merge
* split
* compress
* pdfjpg
* imagepdf
* unlock
* pagenumber
* watermark
* officepdf
* repair
* rotate
* protect
* pdfa
* validatepdfa
* extract

### task.addFile(filePath[,fileOptions])
Add file to current task.

```javascript
await task.addFile('./input.pdf', {
  rotate: 0
  password: null
});

```

### task.addFileByStream(filename, stream[,fileOptions])
Add file to current task.

```javascript
await task.addFileByStream('input.pdf', myStream, {
  rotate: 0
  password: null
});

```

### task.process([extraParams])
Start process current task.

About extraParams, see [Process API](https://developer.ilovepdf.com/docs/api-reference#process)

```javascript
await task.process({
  metas: {
    Title: 'My Document'
  },
  ignore_errors: true,
  // SPECIFIC TOOL PARAMETERS
  split_mode: 'ranges'
});
```


### task.download(outputFilePath)

Download result file.

### task.downloadAsStream

Download result file as stream.


## Documentation

Please see https://developer.ilovepdf.com/docs for up-to-date documentation.