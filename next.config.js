const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')
const withSASS = require('@zeit/next-sass')
const dotenv = require('dotenv-extended').load()

module.exports = withPlugins([
  [withTM, {
    transpileModules: ['rbx']
  }],
  withSASS,
], {
  publicRuntimeConfig: {
    appName: dotenv.APP_NAME,
    debug: `${dotenv.DEBUG}`
  }
});
