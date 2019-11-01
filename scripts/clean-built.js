const trash = require('trash');
const resolveCwd = require('./resolveCwd');

(async () => {
  await trash([resolveCwd('dist')]);
  await trash([resolveCwd('build')]);
})();
