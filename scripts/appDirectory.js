const { realpathSync } = require('fs');

const appDirectory = realpathSync(process.cwd());

module.exports = appDirectory;
