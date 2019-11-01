const trash = require('trash');
const resolveCwd = require('./resolveCwd');

(async () => {
  await trash([
    resolveCwd('yarn.lock'),
    resolveCwd('package-lock.json'),

    resolveCwd('node_modules'),
  ]);
})();
