var env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {

  /*
    HEY CITZ DEVELOPER!!! DO NOT FORGET TO ASK BY
    THE FILE "local_config.json". IT IS IN ".gitignore"
    BY SECURITY REASONS
  */
  var config = require('./local_config.json');
  var envConfig = config[env];

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}
