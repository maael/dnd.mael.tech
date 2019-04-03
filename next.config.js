const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')
const withSASS = require('@zeit/next-sass')
const dotenv = require('dotenv-extended').load()

module.exports = withPlugins([
  [withTM, {
    transpileModules: ['rbx', 'ky']
  }],
  withSASS,
], {
  publicRuntimeConfig: {
    appName: dotenv.APP_NAME,
    debug: dotenv.DEBUG
  },
  serverRuntimeConfig: {
    aws: {
      accessKeyId: dotenv.AWS_ACCESS_KEY_ID,
      secretAccessKey: dotenv.AWS_SECRET_ACCESS_KEY,
      region: dotenv.AWS_REGION
    }
  }
});
