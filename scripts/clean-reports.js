const trash = require('trash');
const resolveCwd = require('./resolveCwd');

(async () => {
  await trash([
    resolveCwd('yarn-error.log'),
    resolveCwd('.yarnclean'),

    resolveCwd('.nyc_output'),

    resolveCwd('coverage'),

    resolveCwd('report'),

    resolveCwd('licenses-development.csv '),
    resolveCwd('licenses-production.csv'),
    resolveCwd('docs/licenses-development.csv '),
    resolveCwd('docs/licenses-production.csv'),
    resolveCwd('doc/licenses-development.csv '),
    resolveCwd('doc/licenses-production.csv'),

    resolveCwd('error.txt'),
    resolveCwd('log.txt'),
  ]);
})();
