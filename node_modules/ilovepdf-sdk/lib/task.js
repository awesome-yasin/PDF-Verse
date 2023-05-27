const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

const { getAgent, setBaseURL} = require('./agent');
const constants = require('./constants');

const TASK_STAGES = constants.TASK_STAGES;

async function startTask() {
  if (this._stage !== TASK_STAGES.NOT_INIT) {
    return null;
  }

  const resp = await this._agent.get(`https://${constants.DEFAULT_ENDPOINT}/v1/start/${this._tool}`);
  this._stage = TASK_STAGES.READY;
  this._server = resp.data.server;
  this._taskId = resp.data.task;
  setBaseURL(this._agent, `https://${this._server}`);

  return resp.data;
}

async function addFileByStream(path, stream, opts) {
  if (this._stage !== TASK_STAGES.READY) {
    throw new Error('task not init');
  }

  const fileItem = {
    local: path,
    server: '',
    opts: opts || {}
  };
  this._files.push(fileItem);

  const form = new FormData();
  form.append('task', this._taskId);
  form.append('file', stream);

  const resp = await this._agent.post('/v1/upload', form, {
    headers: form.getHeaders()
  });

  fileItem.server = resp.data.server_filename;
  return resp.data;
}

async function addFile(path, opts) {
  const data = this.addFileByStream(path, fs.createReadStream(path), opts);
  return data;
}

async function process(extraParams) {
  if (this._stage !== TASK_STAGES.READY) {
    throw new Error('wrong task stage');
  }

  if (this._files.length === 0) {
    throw new Error('no file added');
  }

  if (this._files.find(file => !file.server)) {
    throw new Error('upload not finished yet');
  }

  const payload = Object.assign(extraParams || {}, {
    task: this._taskId,
    tool: this._tool,
    files: this._files.map((f) => {
      return Object.assign(f.opts, {
        server_filename: f.server,
        filename: path.basename(f.local),
      });
    })
  });

  const resp = await this._agent.post('/v1/process', payload);

  this._stage = TASK_STAGES.PROCESSED;
  return resp.data;
}

async function downloadAsStream() {
  if (this._stage !== TASK_STAGES.PROCESSED) {
    throw new Error('task not processed');
  }
  const resp = await this._agent.get(`/v1/download/${this._taskId}`, {
    responseType: 'stream'
  });

  return resp.data;
}

function waitStream(stream){
  return new Promise((resolve, reject) => {
    stream.on('finish', () => { resolve(); });
    stream.on('error', () => { reject(); });
  });
}

async function downloadFile(path) {
  const data = await this.downloadAsStream();
  const writeStream = fs.createWriteStream(path);
  await waitStream(data.pipe(writeStream));
  return true;
}

function Task(tool, publicId, secretKey) {
  if (constants.TASK_TYPES.indexOf(tool) < 0) {
    throw new Error('invalid task type: ' + tool);
  }
  this._agent = getAgent(publicId, secretKey);
  this._files = [];
  this._tool = tool;
  this._stage = TASK_STAGES.NOT_INIT;
}

Task.prototype = {
  start: startTask,
  addFileByStream: addFileByStream,
  addFile: addFile,
  process: process,
  downloadAsStream: downloadAsStream,
  download: downloadFile,
};

module.exports = Task;