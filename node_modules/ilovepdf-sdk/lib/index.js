
const Task = require('./task');

function SDK (publicId, secretKey) {
  return {
    async createTask(tool) {
      const task = new Task(tool, publicId, secretKey);
      await task.start();
      return task;
    },
  }
}

module.exports = SDK;