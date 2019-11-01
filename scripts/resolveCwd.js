const { resolve } = require('path');
const appDirectory = require('./appDirectory');

const resolveCwd = relativePath => resolve(appDirectory, relativePath);

module.exports = resolveCwd;
