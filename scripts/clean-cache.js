const trash = require('trash');
const resolveCwd = require('./resolveCwd');

(async () => {
  await trash([resolveCwd('.eslintcache'), resolveCwd('.next')]);
})();
