const withPlugins = require('next-compose-plugins')
const withTM = require('next-transpile-modules')
const withCSS = require('@zeit/next-css')
const dotenv = require('dotenv-extended').load()

module.exports = withPlugins([
  [withTM, {
    transpileModules: ['rbx']
  }],
  withCSS,
], {
  publicRuntimeConfig: {
    appName: dotenv.APP_NAME,
    debug: `${dotenv.DEBUG}`
  }
});
